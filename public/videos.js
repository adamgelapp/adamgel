document.querySelectorAll('video[data-playlist]').forEach(video => {
  const source = video.dataset.playlist;
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else if (window.Hls && Hls.isSupported()) {
    const player = new Hls({ autoStartLoad: false });
    player.loadSource(source);
    player.attachMedia(video);
    video.addEventListener('play', () => player.startLoad(), { once: true });
    player.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) document.querySelector('.video-status').textContent = 'The video could not load. Please refresh the page and try again.';
    });
  } else {
    document.querySelector('.video-status').textContent = 'Please use a current version of Safari, Chrome, Edge or Firefox to watch these tutorials.';
  }
});
