(() => {
  'use strict';

  const STORAGE_KEY = 'my-study-lms.tasks.v1';
  const THEME_KEY = 'my-study-lms.theme';

  const todayISO = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
  };

  const addDaysISO = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  };

  const uid = () => globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const seedTasks = [
    {
      id: uid(), title: 'Tugas UI/UX', category: 'Desain • Proyek', emoji: '🎨',
      description: 'Membuat prototype dashboard LMS pribadi yang mencakup halaman beranda, daftar tugas, kalender, dan statistik belajar.',
      deadline: todayISO(), time: '18:00', priority: 'high', estimate: '6 jam', progress: 60, completed: false, favorite: true,
      notes: 'Gunakan layout dua panel. Fokus pada interaksi task card, modal, dan penyimpanan localStorage.',
      subtasks: [
        { id: uid(), title: 'Riset referensi dashboard LMS', done: true },
        { id: uid(), title: 'Wireframe halaman utama', done: true },
        { id: uid(), title: 'Desain UI halaman beranda', done: false },
        { id: uid(), title: 'Desain halaman daftar tugas dan kalender', done: false },
        { id: uid(), title: 'Prototype interaktif', done: false }
      ]
    },
    {
      id: uid(), title: 'Matematika', category: 'Aljabar & Fungsi', emoji: '📐',
      description: 'Mengerjakan latihan fungsi kuadrat dan membuat ringkasan rumus sebelum pertemuan berikutnya.',
      deadline: addDaysISO(1), time: '20:00', priority: 'medium', estimate: '3 jam', progress: 75, completed: false, favorite: false,
      notes: '', subtasks: [
        { id: uid(), title: 'Baca materi fungsi kuadrat', done: true },
        { id: uid(), title: 'Kerjakan 15 soal latihan', done: true },
        { id: uid(), title: 'Buat ringkasan satu halaman', done: false }
      ]
    },
    {
      id: uid(), title: 'Presentasi', category: 'Pitch Deck Proyek', emoji: '🎤',
      description: 'Menyusun pitch deck proyek kelompok dan melakukan latihan presentasi selama tujuh menit.',
      deadline: addDaysISO(2), time: '13:00', priority: 'high', estimate: '4 jam', progress: 40, completed: false, favorite: false,
      notes: '', subtasks: [
        { id: uid(), title: 'Finalisasi masalah dan solusi', done: true },
        { id: uid(), title: 'Masukkan data pendukung', done: false },
        { id: uid(), title: 'Latihan presentasi', done: false }
      ]
    },
    {
      id: uid(), title: 'Database', category: 'ERD & Normalisasi', emoji: '🗄️',
      description: 'Membuat ERD sistem akademik sederhana dan melakukan normalisasi sampai bentuk normal ketiga.',
      deadline: addDaysISO(4), time: '21:00', priority: 'medium', estimate: '5 jam', progress: 30, completed: false, favorite: false,
      notes: '', subtasks: [
        { id: uid(), title: 'Identifikasi entitas dan atribut', done: true },
        { id: uid(), title: 'Tentukan relasi', done: false },
        { id: uid(), title: 'Normalisasi tabel', done: false }
      ]
    },
    {
      id: uid(), title: 'Laporan', category: 'Analisis Data', emoji: '📊',
      description: 'Menyelesaikan laporan analisis data, memeriksa tabel hasil, dan merapikan format sitasi.',
      deadline: addDaysISO(3), time: '16:00', priority: 'high', estimate: '7 jam', progress: 80, completed: false, favorite: false,
      notes: '', subtasks: [
        { id: uid(), title: 'Periksa data dan tabel', done: true },
        { id: uid(), title: 'Tulis pembahasan', done: true },
        { id: uid(), title: 'Rapikan sitasi', done: false }
      ]
    },
    {
      id: uid(), title: 'Quiz', category: 'Pemrograman Dasar', emoji: '💻',
      description: 'Mempelajari kembali array, perulangan, dan fungsi untuk persiapan kuis pemrograman dasar.',
      deadline: addDaysISO(5), time: '09:00', priority: 'low', estimate: '2 jam', progress: 25, completed: false, favorite: false,
      notes: '', subtasks: [
        { id: uid(), title: 'Review array', done: true },
        { id: uid(), title: 'Latihan perulangan', done: false },
        { id: uid(), title: 'Latihan fungsi', done: false }
      ]
    }
  ];

  let tasks = loadTasks();
  let selectedTaskId = tasks[0]?.id ?? null;
  let activeFilter = 'all';
  let searchTerm = '';
  let sortMode = 'default';
  let saveNotesTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const refs = {
    taskGrid: $('#taskGrid'), emptyState: $('#emptyState'), selectedEmoji: $('#selectedEmoji'), selectedCategory: $('#selectedCategory'),
    selectedTitle: $('#selectedTitle'), selectedPriority: $('#selectedPriority'), selectedDate: $('#selectedDate'), selectedDescription: $('#selectedDescription'),
    deadlineText: $('#deadlineText'), deadlineTime: $('#deadlineTime'), statusText: $('#statusText'), estimateText: $('#estimateText'),
    detailProgressText: $('#detailProgressText'), detailProgressBar: $('#detailProgressBar'), subtaskList: $('#subtaskList'), notesField: $('#notesField'),
    saveStatus: $('#saveStatus'), xpStat: $('#xpStat'), coinStat: $('#coinStat'), targetStat: $('#targetStat'), completedSummary: $('#completedSummary'),
    summaryPercent: $('#summaryPercent'), summaryProgressBar: $('#summaryProgressBar'), completeTaskButton: $('#completeTaskButton'),
    taskModal: $('#taskModal'), taskForm: $('#taskForm'), modalTitle: $('#modalTitle'), taskId: $('#taskId'), taskTitle: $('#taskTitle'),
    taskCategory: $('#taskCategory'), taskEmoji: $('#taskEmoji'), taskDescription: $('#taskDescription'), taskDeadline: $('#taskDeadline'),
    taskTime: $('#taskTime'), taskPriority: $('#taskPriority'), taskEstimate: $('#taskEstimate'), taskProgress: $('#taskProgress'),
    progressValue: $('#progressValue'), toast: $('#toast'), subtaskModal: $('#subtaskModal'), subtaskForm: $('#subtaskForm'), subtaskTitle: $('#subtaskTitle')
  };

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (error) {
      console.warn('Data lokal tidak dapat dibaca.', error);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
    return seedTasks;
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function getSelectedTask() {
    return tasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? null;
  }

  function formatDate(dateString, includeYear = true) {
    if (!dateString) return '-';
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', ...(includeYear ? { year: 'numeric' } : {})
    }).format(date);
  }

  function dateLabel(dateString) {
    if (dateString === todayISO()) return 'Hari ini';
    if (dateString === addDaysISO(1)) return 'Besok';
    return formatDate(dateString, false);
  }

  function getPriorityMeta(priority) {
    return {
      high: { label: 'Prioritas Tinggi', color: '#ff6480', icon: '🔥', rank: 3 },
      medium: { label: 'Prioritas Sedang', color: '#ffb52a', icon: '●', rank: 2 },
      low: { label: 'Prioritas Rendah', color: '#49b58b', icon: '●', rank: 1 }
    }[priority] ?? { label: 'Prioritas Sedang', color: '#8da8be', icon: '●', rank: 0 };
  }

  function getTaskStatus(task) {
    if (task.completed || task.progress >= 100) return { label: 'Selesai', className: 'completed' };
    if (task.progress >= 70) return { label: 'Hampir Selesai', className: 'warning' };
    if (task.progress > 0) return { label: 'Dalam Proses', className: 'progress' };
    return { label: 'Belum Dimulai', className: '' };
  }

  function cardSoftColor(index) {
    return ['#efe8ff', '#fff1be', '#dff8f1', '#dff1ff', '#ffe7ec', '#fff0d8'][index % 6];
  }

  function render() {
    if (!tasks.length) selectedTaskId = null;
    if (selectedTaskId && !tasks.some((task) => task.id === selectedTaskId)) selectedTaskId = tasks[0]?.id ?? null;
    renderTaskGrid();
    renderSelectedTask();
    renderStats();
  }

  function renderTaskGrid() {
    let visible = tasks.filter((task) => {
      const filterMatch = activeFilter === 'all'
        || (activeFilter === 'today' && task.deadline === todayISO())
        || (activeFilter === 'completed' && task.completed);
      const query = `${task.title} ${task.category} ${task.description}`.toLowerCase();
      return filterMatch && query.includes(searchTerm.toLowerCase());
    });

    if (sortMode === 'deadline') visible = [...visible].sort((a, b) => `${a.deadline}T${a.time}`.localeCompare(`${b.deadline}T${b.time}`));
    if (sortMode === 'progress-desc') visible = [...visible].sort((a, b) => b.progress - a.progress);
    if (sortMode === 'priority') visible = [...visible].sort((a, b) => getPriorityMeta(b.priority).rank - getPriorityMeta(a.priority).rank);

    refs.taskGrid.innerHTML = '';
    refs.emptyState.hidden = visible.length > 0;

    visible.forEach((task, index) => {
      const status = getTaskStatus(task);
      const priority = getPriorityMeta(task.priority);
      const card = document.createElement('article');
      card.className = `task-card${task.id === selectedTaskId ? ' selected' : ''}`;
      card.style.setProperty('--card-soft', cardSoftColor(index));
      card.style.setProperty('--priority-color', priority.color);
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Buka tugas ${task.title}`);
      card.innerHTML = `
        <span class="card-priority" title="${priority.label}"></span>
        <button class="favorite-button ${task.favorite ? 'active' : ''}" data-favorite="${task.id}" aria-label="Favoritkan tugas">${task.favorite ? '★' : '☆'}</button>
        <div class="card-icon">${escapeHTML(task.emoji)}</div>
        <h3>${escapeHTML(task.title)}</h3>
        <p class="card-category">${escapeHTML(task.category)}</p>
        <div class="card-progress-row">
          <div class="progress-track"><span style="width:${task.progress}%"></span></div>
          <strong>${task.progress}%</strong>
        </div>
        <div class="card-status ${status.className}">${status.label}</div>
      `;

      card.addEventListener('click', (event) => {
        if (event.target.closest('[data-favorite]')) return;
        selectedTaskId = task.id;
        render();
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectedTaskId = task.id;
          render();
        }
      });
      refs.taskGrid.appendChild(card);
    });

    $$('[data-favorite]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const task = tasks.find((item) => item.id === button.dataset.favorite);
        if (!task) return;
        task.favorite = !task.favorite;
        saveTasks();
        renderTaskGrid();
        toast(task.favorite ? 'Tugas ditambahkan ke favorit.' : 'Tugas dihapus dari favorit.');
      });
    });
  }

  function renderSelectedTask() {
    const task = getSelectedTask();
    const disabled = !task;
    $('#editTaskButton').disabled = disabled;
    $('#completeTaskButton').disabled = disabled;
    $('#deleteTaskButton').disabled = disabled;
    $('#addSubtaskButton').disabled = disabled;
    refs.notesField.disabled = disabled;

    if (!task) {
      refs.selectedEmoji.textContent = '🫧';
      refs.selectedCategory.textContent = 'Belum ada tugas';
      refs.selectedTitle.textContent = 'Tambahkan tugas baru';
      refs.selectedPriority.textContent = 'Prioritas belum ditentukan';
      refs.selectedDate.textContent = 'Deadline belum ditentukan';
      refs.selectedDescription.textContent = 'Gunakan tombol Tambah Tugas untuk membuat aktivitas belajar pertama.';
      refs.deadlineText.textContent = '-'; refs.deadlineTime.textContent = '-'; refs.statusText.textContent = '-'; refs.estimateText.textContent = '-';
      refs.detailProgressText.textContent = '0%'; refs.detailProgressBar.style.width = '0%'; refs.subtaskList.innerHTML = '';
      refs.notesField.value = '';
      return;
    }

    const priority = getPriorityMeta(task.priority);
    const status = getTaskStatus(task);
    refs.selectedEmoji.textContent = task.emoji;
    refs.selectedCategory.textContent = task.category;
    refs.selectedTitle.textContent = task.title;
    refs.selectedPriority.textContent = `${priority.icon} ${priority.label}`;
    refs.selectedDate.textContent = `📅 ${dateLabel(task.deadline)}`;
    refs.selectedDescription.textContent = task.description;
    refs.deadlineText.textContent = formatDate(task.deadline);
    refs.deadlineTime.textContent = `${task.time} WIB`;
    refs.statusText.textContent = status.label;
    refs.statusText.className = `status-chip ${status.className}`;
    refs.estimateText.textContent = task.estimate;
    refs.detailProgressText.textContent = `${task.progress}%`;
    refs.detailProgressBar.style.width = `${task.progress}%`;
    refs.completeTaskButton.textContent = task.completed ? '↺ Buka Kembali' : '✓ Selesai';
    refs.notesField.value = task.notes || '';
    renderSubtasks(task);
  }

  function renderSubtasks(task) {
    refs.subtaskList.innerHTML = '';
    if (!task.subtasks?.length) {
      refs.subtaskList.innerHTML = '<div class="empty-state"><div>☑</div><h3>Belum ada subtugas</h3><p>Tambahkan langkah kecil agar tugas lebih mudah dikerjakan.</p></div>';
      return;
    }

    task.subtasks.forEach((subtask) => {
      const row = document.createElement('label');
      row.className = `subtask-item${subtask.done ? ' done' : ''}`;
      row.innerHTML = `
        <input type="checkbox" ${subtask.done ? 'checked' : ''} aria-label="Tandai ${escapeHTML(subtask.title)}">
        <span>${escapeHTML(subtask.title)}</span>
        <button type="button" class="subtask-delete" title="Hapus subtugas">×</button>
      `;
      row.querySelector('input').addEventListener('change', (event) => {
        subtask.done = event.target.checked;
        recalculateProgressFromSubtasks(task);
        saveTasks();
        render();
      });
      row.querySelector('.subtask-delete').addEventListener('click', (event) => {
        event.preventDefault();
        task.subtasks = task.subtasks.filter((item) => item.id !== subtask.id);
        recalculateProgressFromSubtasks(task);
        saveTasks();
        render();
        toast('Subtugas dihapus.');
      });
      refs.subtaskList.appendChild(row);
    });
  }

  function recalculateProgressFromSubtasks(task) {
    if (!task.subtasks?.length) return;
    const done = task.subtasks.filter((item) => item.done).length;
    task.progress = Math.round((done / task.subtasks.length) * 100);
    task.completed = task.progress === 100;
  }

  function renderStats() {
    const completed = tasks.filter((task) => task.completed).length;
    const subtaskDone = tasks.reduce((sum, task) => sum + (task.subtasks?.filter((item) => item.done).length || 0), 0);
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    refs.xpStat.textContent = `${completed * 250 + subtaskDone * 35} XP`;
    refs.coinStat.textContent = new Intl.NumberFormat('id-ID').format(completed * 120 + subtaskDone * 15);
    refs.targetStat.textContent = `${percent}%`;
    refs.completedSummary.textContent = `${completed}/${total} tugas selesai`;
    refs.summaryPercent.textContent = `${percent}%`;
    refs.summaryProgressBar.style.width = `${percent}%`;
  }

  function openTaskModal(mode = 'add') {
    const task = getSelectedTask();
    refs.taskForm.reset();
    refs.taskProgress.value = '0';
    refs.progressValue.textContent = '0%';
    refs.taskDeadline.value = todayISO();
    refs.taskTime.value = '18:00';
    refs.taskPriority.value = 'medium';

    if (mode === 'edit' && task) {
      refs.modalTitle.textContent = 'Edit Tugas';
      refs.taskId.value = task.id;
      refs.taskTitle.value = task.title;
      refs.taskCategory.value = task.category;
      refs.taskEmoji.value = task.emoji;
      refs.taskDescription.value = task.description;
      refs.taskDeadline.value = task.deadline;
      refs.taskTime.value = task.time;
      refs.taskPriority.value = task.priority;
      refs.taskEstimate.value = task.estimate;
      refs.taskProgress.value = task.progress;
      refs.progressValue.textContent = `${task.progress}%`;
    } else {
      refs.modalTitle.textContent = 'Tambah Tugas';
      refs.taskId.value = '';
    }

    refs.taskModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => refs.taskTitle.focus(), 50);
  }

  function closeTaskModal() {
    refs.taskModal.hidden = true;
    document.body.style.overflow = '';
  }

  function openSubtaskModal() {
    if (!getSelectedTask()) return;
    refs.subtaskForm.reset();
    refs.subtaskModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => refs.subtaskTitle.focus(), 50);
  }

  function closeSubtaskModal() {
    refs.subtaskModal.hidden = true;
    document.body.style.overflow = '';
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const data = {
      title: refs.taskTitle.value.trim(), category: refs.taskCategory.value.trim(), emoji: refs.taskEmoji.value,
      description: refs.taskDescription.value.trim(), deadline: refs.taskDeadline.value, time: refs.taskTime.value,
      priority: refs.taskPriority.value, estimate: refs.taskEstimate.value.trim(), progress: Number(refs.taskProgress.value)
    };

    if (!data.title || !data.category || !data.description || !data.deadline || !data.time || !data.estimate) {
      toast('Lengkapi seluruh data tugas.');
      return;
    }

    const existing = tasks.find((task) => task.id === refs.taskId.value);
    if (existing) {
      Object.assign(existing, data, { completed: data.progress >= 100 });
      selectedTaskId = existing.id;
      toast('Tugas berhasil diperbarui.');
    } else {
      const task = {
        id: uid(), ...data, completed: data.progress >= 100, favorite: false, notes: '', subtasks: []
      };
      tasks.unshift(task);
      selectedTaskId = task.id;
      toast('Tugas baru berhasil ditambahkan.');
    }
    saveTasks();
    closeTaskModal();
    render();
  }

  function toggleComplete() {
    const task = getSelectedTask();
    if (!task) return;
    task.completed = !task.completed;
    task.progress = task.completed ? 100 : Math.min(task.progress, 90);
    if (task.subtasks?.length) task.subtasks.forEach((subtask) => { subtask.done = task.completed ? true : subtask.done; });
    saveTasks();
    render();
    toast(task.completed ? 'Hebat! Tugas telah diselesaikan.' : 'Tugas dibuka kembali.');
  }

  function deleteSelectedTask() {
    const task = getSelectedTask();
    if (!task) return;
    const approved = window.confirm(`Hapus tugas “${task.title}”? Data tidak dapat dikembalikan.`);
    if (!approved) return;
    tasks = tasks.filter((item) => item.id !== task.id);
    selectedTaskId = tasks[0]?.id ?? null;
    saveTasks();
    render();
    toast('Tugas dihapus.');
  }

  function toast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => refs.toast.classList.remove('show'), 2400);
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function initEvents() {
    $('#addTaskButton').addEventListener('click', () => openTaskModal('add'));
    $('#addTaskButtonLeft').addEventListener('click', () => openTaskModal('add'));
    $('#editTaskButton').addEventListener('click', () => openTaskModal('edit'));
    $('#completeTaskButton').addEventListener('click', toggleComplete);
    $('#deleteTaskButton').addEventListener('click', deleteSelectedTask);
    $('#modalClose').addEventListener('click', closeTaskModal);
    $('#cancelModal').addEventListener('click', closeTaskModal);
    refs.taskModal.addEventListener('click', (event) => { if (event.target === refs.taskModal) closeTaskModal(); });
    refs.taskForm.addEventListener('submit', handleTaskSubmit);
    refs.taskProgress.addEventListener('input', () => { refs.progressValue.textContent = `${refs.taskProgress.value}%`; });

    $('#addSubtaskButton').addEventListener('click', openSubtaskModal);
    $('#subtaskModalClose').addEventListener('click', closeSubtaskModal);
    $('#cancelSubtaskModal').addEventListener('click', closeSubtaskModal);
    refs.subtaskModal.addEventListener('click', (event) => { if (event.target === refs.subtaskModal) closeSubtaskModal(); });
    refs.subtaskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const task = getSelectedTask();
      const title = refs.subtaskTitle.value.trim();
      if (!task || !title) return;
      task.subtasks ??= [];
      task.subtasks.push({ id: uid(), title, done: false });
      recalculateProgressFromSubtasks(task);
      saveTasks();
      closeSubtaskModal();
      render();
      toast('Subtugas berhasil ditambahkan.');
    });

    $$('.filter-tab').forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        $$('.filter-tab').forEach((item) => item.classList.toggle('active', item === button));
        renderTaskGrid();
      });
    });

    $$('.detail-tab').forEach((button) => {
      button.addEventListener('click', () => {
        $$('.detail-tab').forEach((item) => item.classList.toggle('active', item === button));
        $$('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${button.dataset.tab}`));
      });
    });

    $('#searchInput').addEventListener('input', (event) => { searchTerm = event.target.value.trim(); renderTaskGrid(); });
    $('#sortSelect').addEventListener('change', (event) => { sortMode = event.target.value; renderTaskGrid(); });

    refs.notesField.addEventListener('input', () => {
      const task = getSelectedTask();
      if (!task) return;
      refs.saveStatus.textContent = 'Menyimpan...';
      clearTimeout(saveNotesTimer);
      saveNotesTimer = setTimeout(() => {
        task.notes = refs.notesField.value;
        saveTasks();
        refs.saveStatus.textContent = 'Tersimpan';
      }, 450);
    });

    $('#rewardButton').addEventListener('click', () => {
      const completed = tasks.filter((task) => task.completed).length;
      toast(completed ? `Kamu memperoleh ${completed * 120} koin dari tugas selesai!` : 'Selesaikan satu tugas untuk membuka hadiah.');
    });

    $('#themeButton').addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const dark = document.body.classList.contains('dark');
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
      $('#themeButton').textContent = dark ? '☀' : '☾';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!refs.taskModal.hidden) closeTaskModal();
      if (!refs.subtaskModal.hidden) closeSubtaskModal();
    });
  }

  function initTheme() {
    const dark = localStorage.getItem(THEME_KEY) === 'dark';
    document.body.classList.toggle('dark', dark);
    $('#themeButton').textContent = dark ? '☀' : '☾';
  }

  initTheme();
  initEvents();
  render();
})();
