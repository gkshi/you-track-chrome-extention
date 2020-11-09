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
    return this.mode === 'develop' ? 'http://localhost:3000/' : 'http://134.122.73.229/';
  }

  getMode () {
    return new Promise((resolve, reject) => {
      const mode = chrome.storage.local.get('mode', res => {
        this.mode = res.mode;
        console.log('mode', mode);
        resolve(res.mode);
      });
    })
  }

  onModeChange () {
    chrome.storage.local.set({mode: this.mode}, () => {});
    if (this.el.checkbox) {
      this.el.checkbox.checked = this.mode === 'develop';
    }
    if (this.el.frame) {
      this.el.frame.src = this.frameUrl;
    }
  }

  addListeners () {
    this.el.checkbox = document.getElementById('mode');
    if (this.el.checkbox) {
      this.el.checkbox.addEventListener('change', e => {
        this.mode = e.target.checked ? 'develop' : 'production';
      })
    }

    this.el.frame = document.getElementById('frame');
  }

  removeListeners () {
    console.log('removeListeners')
  }

  async init() {
    this.addListeners();

    await this.getMode();

    // if (this.el.frame) {
    //   this.el.frame.src = this.frameUrl;
    // }

    document.addEventListener("unload", () => {
      this.removeListeners();
    });

    window.APP = {
      mode: this.mode
    };

    return window.APP;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new APP().init();
});
