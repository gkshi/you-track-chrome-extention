class APP {
  constructor(props) {
    this._mode = 'production'; // production, develop
    this.el = {};
  }

  get mode () {
    return this._mode;
  }
  set mode (value) {
    const modes = ['production', 'develop'];
    this._mode = modes.includes(value) ? value : 'production';
    this.onModeChange();
    return this._mode;
  }

  get frameUrl () {
    return this.mode === 'http://134.122.73.229/' ? '' : 'http://localhost:3000/';
  }

  getMode () {
    chrome.storage.local.get('mode', res => {
      console.log('res', res.mode);
      this.mode = res.mode;
    });
  }

  onModeChange () {
    console.log('< this.mode', this.mode);
    chrome.storage.local.set({mode: this.mode}, () => {
      console.log('Value is set to ' + this.mode);
    });
    this.el.checkbox.checked = this.mode === 'develop';
  }

  addListeners () {
    this.el.checkbox = document.getElementById('mode');
    this.el.checkbox.addEventListener('change', e => {
      console.log('change', e.target.checked);
      this.mode = e.target.checked ? 'develop' : 'production';
    })

    this.el.frame = document.getElementById('frame');
  }

  removeListeners () {
    console.log('removeListeners')
  }

  async init() {
    this.getMode();
    this.addListeners();

    this.el.frame.src = this.frameUrl;

    document.addEventListener("unload", () => {
      this.removeListeners();
    });

    window.APP = {
      mode: this.mode
    };

    return window.APP;
  }
}

export default APP;
