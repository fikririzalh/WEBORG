"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eogvclykzeejxasbjmau.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GVwdwydl82CAjNa97FCCGg_Cii5p7Nb";
const ACTIVE_ROOM_KEY = "bunny-stakes.active-room.v1";
const THEME_KEY = "bunny-stakes.theme.v1";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

type Room = {
  id: string;
  code: string;
  name: string;
  host_id: string;
  starting_chips: number;
  middle_pot: number;
  status: "active" | "finished";
  created_at: string;
};

type Player = {
  id: string;
  room_id: string;
  user_id: string;
  name: string;
  chips: number;
  is_host: boolean;
  joined_at: string;
};

type ChipTransaction = {
  id: string;
  room_id: string;
  actor_user_id: string | null;
  from_player_id: string | null;
  to_player_id: string | null;
  transaction_type: string;
  amount: number;
  description: string | null;
  created_at: string;
};

type ActionState =
  | { type: "transfer"; player: Player }
  | { type: "adjust"; player: Player }
  | null;

const formatChip = (value: number) => new Intl.NumberFormat("id-ID").format(value || 0);

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Terjadi kesalahan. Silakan coba lagi.";
}

function transactionIcon(type: string) {
  const icons: Record<string, string> = {
    room_created: "✦",
    player_joined: "+",
    bet: "↘",
    transfer: "⇄",
    pot_awarded: "♛",
    host_adjustment: "±",
  };
  return icons[type] ?? "•";
}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [transactions, setTransactions] = useState<ChipTransaction[]>([]);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"create" | "join">("create");
  const [roomName, setRoomName] = useState("Meja Jumat Malam");
  const [playerName, setPlayerName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [startingChips, setStartingChips] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);
  const [action, setAction] = useState<ActionState>(null);
  const [actionAmount, setActionAmount] = useState(50);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sound, setSound] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const me = useMemo(() => players.find((player) => player.user_id === userId) ?? null, [players, userId]);
  const isHost = room?.host_id === userId;
  const totalOnTable = useMemo(
    () => players.reduce((sum, player) => sum + Number(player.chips), 0) + Number(room?.middle_pot ?? 0),
    [players, room?.middle_pot],
  );

  const tone = useCallback(
    (kind: "ok" | "bet" | "win" = "ok") => {
      if (!sound || typeof window === "undefined") return;
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const frequency = kind === "win" ? 820 : kind === "bet" ? 360 : 620;
      oscillator.type = kind === "win" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, context.currentTime + 0.09);
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.11);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.11);
    },
    [sound],
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = savedTheme;

    const code = new URLSearchParams(window.location.search).get("room");
    queueMicrotask(() => {
      setTheme(savedTheme);
      if (code) {
        setJoinCode(code.toUpperCase());
        setTab("join");
      }
    });

    let active = true;
    async function authenticate() {
      const { data } = await supabase.auth.getSession();
      let session = data.session;
      if (!session) {
        const result = await supabase.auth.signInAnonymously();
        if (result.error) {
          if (active) setError(`Autentikasi gagal: ${result.error.message}`);
          return;
        }
        session = result.data.session;
      }
      if (!active) return;
      if (session?.access_token) {
        await supabase.realtime.setAuth(session.access_token);
      }
      setUserId(session?.user.id ?? null);
      setAuthReady(true);
      const savedRoom = localStorage.getItem(ACTIVE_ROOM_KEY);
      if (savedRoom) setRoomId(savedRoom);
    }
    authenticate();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        void supabase.realtime.setAuth(session.access_token);
      }
      if (session?.user.id) setUserId(session.user.id);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadRoom = useCallback(async (targetRoomId: string, quiet = false) => {
    if (!quiet) setLoadingRoom(true);
    const [roomResult, playerResult, transactionResult] = await Promise.all([
      supabase.from("rooms").select("*").eq("id", targetRoomId).single(),
      supabase.from("players").select("*").eq("room_id", targetRoomId).order("joined_at"),
      supabase
        .from("chip_transactions")
        .select("*")
        .eq("room_id", targetRoomId)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    if (roomResult.error || playerResult.error || transactionResult.error) {
      if (!quiet) {
        setError("Room tidak dapat dibuka. Sesi mungkin sudah tidak tersedia di perangkat ini.");
        localStorage.removeItem(ACTIVE_ROOM_KEY);
        setRoomId(null);
      }
      setLoadingRoom(false);
      return;
    }

    setRoom(roomResult.data as Room);
    setPlayers((playerResult.data ?? []) as Player[]);
    setTransactions((transactionResult.data ?? []) as ChipTransaction[]);
    setLoadingRoom(false);
  }, []);

  useEffect(() => {
    if (!authReady || !roomId) return;

    let disposed = false;
    let channel: RealtimeChannel | null = null;
    let reconnectTimer: number | null = null;
    let refreshTimer: number | null = null;

    const refreshRoom = (immediate = false) => {
      if (disposed) return;
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        if (!disposed) void loadRoom(roomId, true);
      }, immediate ? 0 : 80);
    };

    const connectRealtime = async () => {
      if (disposed) return;

      const previousChannel = channel;
      channel = null;
      if (channelRef.current === previousChannel) channelRef.current = null;
      if (previousChannel) await supabase.removeChannel(previousChannel);

      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        await supabase.realtime.setAuth(data.session.access_token);
      }
      if (disposed) return;

      const nextChannel = supabase
        .channel(`bunny-room-${roomId}-${crypto.randomUUID()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, () => refreshRoom())
        .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` }, () => refreshRoom())
        .on("postgres_changes", { event: "*", schema: "public", table: "chip_transactions", filter: `room_id=eq.${roomId}` }, () => refreshRoom());

      channel = nextChannel;
      channelRef.current = nextChannel;
      nextChannel.subscribe((status) => {
        if (disposed || channel !== nextChannel) return;
        if (status === "SUBSCRIBED") {
          refreshRoom(true);
          return;
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
          reconnectTimer = window.setTimeout(() => {
            reconnectTimer = null;
            void connectRealtime();
          }, 1500);
        }
      });
    };

    void loadRoom(roomId);
    void connectRealtime();

    const syncWhenActive = () => {
      if (document.visibilityState === "visible") refreshRoom(true);
    };
    const fallbackTimer = window.setInterval(syncWhenActive, 5000);
    window.addEventListener("focus", syncWhenActive);
    window.addEventListener("online", syncWhenActive);
    document.addEventListener("visibilitychange", syncWhenActive);

    return () => {
      disposed = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      window.clearInterval(fallbackTimer);
      window.removeEventListener("focus", syncWhenActive);
      window.removeEventListener("online", syncWhenActive);
      document.removeEventListener("visibilitychange", syncWhenActive);

      const currentChannel = channel;
      channel = null;
      if (channelRef.current === currentChannel) channelRef.current = null;
      if (currentChannel) void supabase.removeChannel(currentChannel);
    };
  }, [authReady, loadRoom, roomId]);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    if (!playerName.trim()) return setError("Masukkan nama host.");
    setBusy(true);
    setError("");
    const { data, error: rpcError } = await supabase.rpc("create_poker_room", {
      room_name: roomName.trim(),
      host_name: playerName.trim(),
      initial_chips: Number(startingChips),
    });
    setBusy(false);
    if (rpcError) return setError(getErrorMessage(rpcError));
    const created = data?.[0];
    if (!created?.room_id) return setError("Room gagal dibuat.");
    localStorage.setItem(ACTIVE_ROOM_KEY, created.room_id);
    window.history.replaceState({}, "", `?room=${created.room_code}`);
    setRoomId(created.room_id);
    tone("ok");
  }

  async function joinRoom(event: FormEvent) {
    event.preventDefault();
    if (!joinName.trim() || joinCode.trim().length < 4) return setError("Masukkan nama dan kode room.");
    setBusy(true);
    setError("");
    const { data, error: rpcError } = await supabase.rpc("join_poker_room", {
      invite_code: joinCode.trim().toUpperCase(),
      player_name: joinName.trim(),
    });
    setBusy(false);
    if (rpcError) return setError(getErrorMessage(rpcError));
    const joined = data?.[0];
    if (!joined?.room_id) return setError("Tidak dapat bergabung ke room.");
    localStorage.setItem(ACTIVE_ROOM_KEY, joined.room_id);
    window.history.replaceState({}, "", `?room=${joined.room_code}`);
    setRoomId(joined.room_id);
    tone("ok");
  }

  async function placeBet(amount: number) {
    if (!roomId || amount <= 0) return;
    setBusy(true);
    setError("");
    const { error: rpcError } = await supabase.rpc("place_bet", {
      target_room_id: roomId,
      bet_amount: Number(amount),
    });
    setBusy(false);
    if (rpcError) return setError(getErrorMessage(rpcError));
    tone("bet");
    flash(`${formatChip(amount)} chip masuk ke middle pot`);
    await loadRoom(roomId, true);
  }

  async function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!action || actionAmount === 0) return;
    setBusy(true);
    setError("");
    const result = action.type === "transfer"
      ? await supabase.rpc("transfer_chips", {
          target_player_id: action.player.id,
          transfer_amount: Math.abs(Number(actionAmount)),
        })
      : await supabase.rpc("host_adjust_chips", {
          target_player_id: action.player.id,
          delta_amount: Number(actionAmount),
        });
    setBusy(false);
    if (result.error) return setError(getErrorMessage(result.error));
    flash(action.type === "transfer" ? `Chip dikirim ke ${action.player.name}` : `Saldo ${action.player.name} diperbarui`);
    setAction(null);
    tone("ok");
    if (roomId) await loadRoom(roomId, true);
  }

  async function awardPot(player: Player) {
    if (!confirm(`Berikan seluruh middle pot kepada ${player.name}?`)) return;
    setBusy(true);
    setError("");
    const { data, error: rpcError } = await supabase.rpc("award_middle_pot", { winner_player_id: player.id });
    setBusy(false);
    if (rpcError) return setError(getErrorMessage(rpcError));
    tone("win");
    flash(`${player.name} memenangkan ${formatChip(Number(data))} chip!`);
    if (roomId) await loadRoom(roomId, true);
  }

  async function copyInvite() {
    if (!room) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${room.code}`;
    await navigator.clipboard.writeText(url);
    flash("Tautan undangan disalin");
  }

  function leaveRoom() {
    localStorage.removeItem(ACTIVE_ROOM_KEY);
    channelRef.current?.unsubscribe();
    setRoomId(null);
    setRoom(null);
    setPlayers([]);
    setTransactions([]);
    window.history.replaceState({}, "", window.location.pathname);
  }

  if (!authReady) {
    return (
      <main className="loading-screen">
        <BunnyMark />
        <p>Menyiapkan meja...</p>
        {error && <div className="error-banner">{error}</div>}
      </main>
    );
  }

  if (roomId && loadingRoom && !room) {
    return (
      <main className="loading-screen">
        <div className="chip-loader"><i /><i /><i /></div>
        <p>Membuka room...</p>
      </main>
    );
  }

  if (!roomId || !room || !me) {
    return (
      <main className="landing-shell">
        <header className="topbar">
          <div className="brand"><BunnyMark /><div><span>Real-time poker chips</span><strong>Bunny Stakes</strong></div></div>
          <div className="top-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label="Ubah tema">{theme === "light" ? "☾" : "☀"}</button>
            <button className="icon-button" onClick={() => setSound((value) => !value)} aria-label="Ubah suara">{sound ? "♪" : "×"}</button>
          </div>
        </header>

        <section className="landing-grid">
          <article className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">Satu meja, banyak perangkat</span>
              <h1>Chip digital untuk poker di dunia nyata.</h1>
              <p>Kartu tetap dimainkan di meja. Saldo, taruhan, transfer, dan middle pot tersinkron otomatis di setiap HP.</p>
              <div className="feature-pills"><span>● Real-time</span><span>♜ Host control</span><span>↗ Link undangan</span></div>
            </div>
            <PokerIllustration />
          </article>

          <article className="entry-panel">
            <div className="entry-tabs" role="tablist">
              <button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>Buat Room</button>
              <button className={tab === "join" ? "active" : ""} onClick={() => setTab("join")}>Gabung Room</button>
            </div>

            {tab === "create" ? (
              <form onSubmit={createRoom} className="entry-form">
                <div><span className="eyebrow">Host setup</span><h2>Buka meja baru</h2><p>Anda menjadi host dan mengatur saldo serta pemenang pot.</p></div>
                <label>Nama room<input value={roomName} onChange={(event) => setRoomName(event.target.value)} maxLength={40} /></label>
                <label>Nama Anda<input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={24} placeholder="Contoh: Budi" /></label>
                <label>Chip awal setiap pemain
                  <div className="chip-options">
                    {[500, 1000, 2500, 5000].map((value) => <button type="button" key={value} className={startingChips === value ? "active" : ""} onClick={() => setStartingChips(value)}>{formatChip(value)}</button>)}
                  </div>
                </label>
                <button className="primary-button" disabled={busy}>{busy ? "Membuat room..." : "Buat Room Sekarang"}<span>→</span></button>
              </form>
            ) : (
              <form onSubmit={joinRoom} className="entry-form">
                <div><span className="eyebrow">Invitation</span><h2>Masuk ke meja</h2><p>Gunakan kode dari host. Tidak perlu email atau kata sandi.</p></div>
                <label>Kode room<input className="code-input" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} maxLength={6} placeholder="ABC123" /></label>
                <label>Nama Anda<input value={joinName} onChange={(event) => setJoinName(event.target.value)} maxLength={24} placeholder="Contoh: Siti" /></label>
                <button className="primary-button" disabled={busy}>{busy ? "Mencari room..." : "Gabung Room"}<span>→</span></button>
              </form>
            )}
            {error && <div className="error-banner">{error}</div>}
            <p className="privacy-note">Identitas perangkat dibuat otomatis. Tidak ada akun, email, atau password.</p>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div className="brand compact"><BunnyMark /><div><span>{room.name}</span><strong>Bunny Stakes</strong></div></div>
        <div className="room-code"><span>KODE ROOM</span><strong>{room.code}</strong><button onClick={copyInvite}>Salin Undangan</button></div>
        <div className="top-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label="Ubah tema">{theme === "light" ? "☾" : "☀"}</button>
          <button className="icon-button" onClick={() => setSound((value) => !value)} aria-label="Ubah suara">{sound ? "♪" : "×"}</button>
          <button className="exit-button" onClick={leaveRoom}>Keluar</button>
        </div>
      </header>

      {room.status === "finished" && <div className="status-banner">Room telah diakhiri oleh host. Data masih dapat dilihat.</div>}
      {error && <div className="error-banner floating"><span>{error}</span><button onClick={() => setError("")}>×</button></div>}
      {notice && <div className="toast">✓ {notice}</div>}

      <section className="table-layout">
        <aside className="balance-card">
          <span className="eyebrow">Saldo Anda</span>
          <div className="balance-value"><ChipMini color="blue" /><strong>{formatChip(me.chips)}</strong></div>
          <p>{me.name}{me.is_host && <b className="host-badge">HOST</b>}</p>
          <div className="balance-stats"><span><small>Total meja</small><b>{formatChip(totalOnTable)}</b></span><span><small>Pemain</small><b>{players.length}</b></span></div>
        </aside>

        <section className="pot-card">
          <div className="felt-ring">
            <div className="chip-stack" aria-hidden="true"><i /><i /><i /><i /></div>
            <span>MIDDLE POT</span>
            <strong>{formatChip(room.middle_pot)}</strong>
            <small>CHIPS</small>
          </div>
          <div className="bet-controls">
            <span>Taruhan cepat</span>
            <div>{[10, 25, 50, 100].map((amount) => <button key={amount} disabled={busy || room.status !== "active"} onClick={() => placeBet(amount)}>+{amount}</button>)}</div>
            <form onSubmit={(event) => { event.preventDefault(); placeBet(betAmount); }}>
              <input type="number" min="1" max={me.chips} value={betAmount} onChange={(event) => setBetAmount(Number(event.target.value))} />
              <button disabled={busy || room.status !== "active"}>Masuk Pot</button>
            </form>
          </div>
        </section>

        <aside className="activity-card">
          <div className="section-title"><div><span className="eyebrow">Live ledger</span><h2>Aktivitas</h2></div><i className="live-dot" /></div>
          <div className="activity-list">
            {transactions.length === 0 && <p className="empty-state">Belum ada transaksi.</p>}
            {transactions.map((item) => (
              <article key={item.id}>
                <span className={`transaction-icon ${item.transaction_type}`}>{transactionIcon(item.transaction_type)}</span>
                <div><strong>{item.description ?? "Aktivitas chip"}</strong><small>{new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</small></div>
                <b>{item.amount > 0 ? formatChip(item.amount) : ""}</b>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="players-section">
        <div className="section-title"><div><span className="eyebrow">Table players</span><h2>Pemain di room</h2></div><p>Pilih pemain untuk transfer atau kontrol host.</p></div>
        <div className="players-grid">
          {players.map((player, index) => {
            const colors = ["blue", "purple", "pink", "green", "yellow"];
            const isMe = player.user_id === userId;
            return (
              <article className={`player-card ${isMe ? "me" : ""}`} key={player.id}>
                <div className="player-avatar" data-color={colors[index % colors.length]}>{player.name.slice(0, 1).toUpperCase()}</div>
                <div className="player-main"><span>{player.is_host ? "Host meja" : isMe ? "Anda" : "Pemain"}</span><h3>{player.name}</h3></div>
                <div className="player-chips"><ChipMini color={colors[index % colors.length]} /><strong>{formatChip(player.chips)}</strong></div>
                <div className="player-actions">
                  {!isMe && <button onClick={() => { setAction({ type: "transfer", player }); setActionAmount(50); }}>Transfer</button>}
                  {isHost && <button onClick={() => { setAction({ type: "adjust", player }); setActionAmount(100); }}>± Chip</button>}
                  {isHost && room.middle_pot > 0 && <button className="winner-button" onClick={() => awardPot(player)}>♛ Menang</button>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="game-footer"><span>Perubahan tersimpan dan tersinkron otomatis.</span><span>Jangan tutup browser jika ingin mempertahankan identitas pemain anonim.</span></footer>

      {action && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAction(null); }}>
          <form className="action-modal" onSubmit={submitAction}>
            <button className="modal-close" type="button" onClick={() => setAction(null)}>×</button>
            <div className="modal-icon">{action.type === "transfer" ? "⇄" : "±"}</div>
            <span className="eyebrow">{action.type === "transfer" ? "Transfer chip" : "Host control"}</span>
            <h2>{action.player.name}</h2>
            <p>{action.type === "transfer" ? "Chip dipindahkan dari saldo Anda ke pemain ini." : "Gunakan angka positif untuk menambah dan negatif untuk mengurangi."}</p>
            <label>Jumlah chip<input autoFocus type="number" value={actionAmount} onChange={(event) => setActionAmount(Number(event.target.value))} min={action.type === "transfer" ? 1 : undefined} /></label>
            <div className="modal-presets">
              {(action.type === "transfer" ? [25, 50, 100, 250] : [-100, -50, 50, 100]).map((amount) => <button type="button" key={amount} onClick={() => setActionAmount(amount)}>{amount > 0 ? "+" : ""}{amount}</button>)}
            </div>
            <button className="primary-button" disabled={busy}>{busy ? "Memproses..." : action.type === "transfer" ? "Kirim Chip" : "Simpan Perubahan"}</button>
          </form>
        </div>
      )}
    </main>
  );
}

function BunnyMark() {
  return <div className="bunny-mark" aria-hidden="true"><i className="ear left" /><i className="ear right" /><span>•ᴗ•</span></div>;
}

function ChipMini({ color }: { color: string }) {
  return <span className="chip-mini" data-color={color}><i /><i /><i /><i /></span>;
}

function PokerIllustration() {
  return (
    <div className="poker-illustration" aria-hidden="true">
      <div className="float-card card-one"><span>A</span><b>♠</b></div>
      <div className="float-card card-two"><span>K</span><b>♥</b></div>
      <div className="hero-bunny"><i className="hero-ear left" /><i className="hero-ear right" /><div className="hero-face"><i /><i /><b>ᴗ</b></div><span>DEALER</span></div>
      <div className="hero-chips-stack"><i /><i /><i /><i /><i /></div>
      <div className="spark one">✦</div><div className="spark two">✧</div>
    </div>
  );
}
