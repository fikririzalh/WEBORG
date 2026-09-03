/* Content integration and Study Guide view for Reading Pasture. */
(function () {
  const originalHome = home;
  const originalRender = render;

  function mergeReadingBank() {
    const merged = new Map();
    (state.readings || []).forEach(reading => merged.set(reading.id, reading));
    [...STARTER_READINGS, ...READING_PASTURE_PACK].forEach(reading => {
      if (!merged.has(reading.id)) merged.set(reading.id, structuredClone(reading));
    });
    const before = state.readings.length;
    state.readings = [...merged.values()];
    if (state.readings.length !== before) save();
  }

  function homeWithCount() {
    originalHome();
    app.innerHTML = app.innerHTML.replace(/100 starter readings/g, `${state.readings.length} readings`);
  }

  function guideView() {
    const completed = Object.values(state.progress).filter(item => item && item.attempts).length;
    app.innerHTML = `
      <div class="guide-hero panel">
        <div>
          <span class="eyebrow">Reader’s toolkit</span>
          <h1>Study Guide</h1>
          <p>Use a clear routine before, during and after reading. The notes below turn every passage into a small lesson, not just a score.</p>
        </div>
        <div class="guide-hero-stat"><strong>${state.readings.length}</strong><span>passages ready</span><small>${completed} completed on this device</small></div>
      </div>

      <div class="section-head"><div><h2>Reading strategies</h2><p>Pick one strategy before you open your next passage.</p></div><button class="btn" id="printGuide">Print guide</button></div>
      <div class="lesson-grid">${READING_PASTURE_LESSONS.map(lesson => `
        <article class="lesson-card panel"><div class="lesson-top"><span class="lesson-icon">${lesson.icon}</span><span class="chip">${esc(lesson.tag)}</span></div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.summary)}</p><ol>${lesson.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><div class="prompt">${esc(lesson.prompt)}</div></article>
      `).join('')}</div>

      <div class="section-head"><div><h2>Match the strategy to the text</h2><p>Different formats require different reading moves.</p></div></div>
      <div class="type-grid">${READING_PASTURE_TEXT_TYPES.map(type => `<article class="type-card panel"><span class="lesson-icon">${type.icon}</span><h3>${esc(type.title)}</h3><p>${esc(type.clue)}</p><b>${esc(type.question)}</b></article>`).join('')}</div>

      <div class="section-head"><div><h2>CEFR orientation</h2><p>Use these bands as learning targets, not as a formal test result.</p></div></div>
      <div class="cefr-list">${READING_PASTURE_CEFR.map((item, index) => `<article class="cefr-row panel"><span class="cefr-badge">${esc(item.level)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div><span class="cefr-step">${index + 1}</span></article>`).join('')}</div>

      <div class="section-head"><div><h2>Seven-day reading routine</h2><p>Repeat the cycle. Increase the level when your accuracy becomes stable.</p></div></div>
      <div class="plan-grid">${READING_PASTURE_PLAN.map(day => `<article class="plan-card panel"><span class="chip">${esc(day.day)}</span><h3>${esc(day.title)}</h3><p>${esc(day.action)}</p></article>`).join('')}</div>

      <div class="section-head"><div><h2>Reference shelf</h2><p>Official and research-informed resources used to shape this guide.</p></div></div>
      <div class="source-list">${READING_PASTURE_SOURCES.map(source => `<a class="source-card panel" href="${source.url}" target="_blank" rel="noopener"><div><h3>${esc(source.title)}</h3><p>${esc(source.description)}</p></div><span aria-hidden="true">↗</span></a>`).join('')}</div>
      <div class="guide-note"><b>How to use the bank:</b> preview a text, answer without hints, check the evidence, then mark useful words in Vocabulary Barn. A low score is a signal to choose a strategy, not a reason to stop.</div>
    `;
    document.getElementById('printGuide').onclick = () => window.print();
    bindCommon();
  }

  // Keep the expanded pack available when the original Reset starter bank action is used.
  READING_PASTURE_PACK.forEach(reading => {
    if (!STARTER_READINGS.some(item => item.id === reading.id)) STARTER_READINGS.push(structuredClone(reading));
  });
  mergeReadingBank();
  home = homeWithCount;
  render = function () {
    if (view === 'guide') guideView();
    else originalRender();
  };
  render();
})();
