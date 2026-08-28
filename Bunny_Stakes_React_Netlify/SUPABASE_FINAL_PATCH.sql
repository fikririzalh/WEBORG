-- Jalankan sekali di Supabase SQL Editor.
-- Policy SELECT membutuhkan hak menjalankan helper pemeriksaan anggota room.
grant execute on function public.is_room_member(uuid) to authenticated;
