// Component that spawns almond entities around the user

export const entitySwapnerComponent = {
  schema: {
    min: { default: 6 },
    max: { default: 10 },
  },
  init() {
    this.prompt = document.getElementById('promptText')
    this.camera = document.getElementById('camera')
    this.popup = document.getElementById('almondPopup')
    this.popupOkBtn = document.getElementById('popupOkBtn')
    this.selectedAlmond = null

    this.hidePopup = this.hidePopup.bind(this)

    if (this.popupOkBtn) {
      this.popupOkBtn.addEventListener('click', this.hidePopup)
    }

    if (this.prompt) {
      this.prompt.textContent = 'Spawning almonds every 5s'
    }

    this.spawnIntervalId = setInterval(() => {
      this.spawnAlmondAroundUser()
    }, 5000)
  },
  remove() {
    if (this.spawnIntervalId) {
      clearInterval(this.spawnIntervalId)
      this.spawnIntervalId = null
    }

    if (this.popupOkBtn) {
      this.popupOkBtn.removeEventListener('click', this.hidePopup)
    }
  },
  showPopup() {
    if (!this.popup) {
      return
    }

    this.popup.classList.remove('hidden')
  },
  hidePopup() {
    if (!this.popup) {
      return
    }

    this.popup.classList.add('hidden')

    if (this.selectedAlmond) {
      const selectedElement = this.selectedAlmond
      this.selectedAlmond = null

      selectedElement.classList.remove('cantap')
      selectedElement.setAttribute('animation__shrink', {
        property: 'scale',
        to: '0 0 0',
        easing: 'easeOutQuad',
        dur: 400,
      })

      selectedElement.addEventListener('animationcomplete__shrink', () => {
        if (selectedElement.parentNode) {
          selectedElement.parentNode.removeChild(selectedElement)
        }
      }, { once: true })

      return
    }

  },
  onAlmondSelected(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault()
    }

    this.selectedAlmond = event && event.currentTarget ? event.currentTarget : null

    this.showPopup()
  },
  spawnAlmondAroundUser() {
    if (!this.camera) {
      return
    }

    const cameraPosition = this.camera.object3D.position
    const radius = 50
    const randomAngle = Math.random() * Math.PI * 2
    const randomDistance = Math.sqrt(Math.random()) * radius
    const spawnX = cameraPosition.x + Math.cos(randomAngle) * randomDistance
    const spawnZ = cameraPosition.z + Math.sin(randomAngle) * randomDistance

    const newElement = document.createElement('a-entity')
    newElement.setAttribute('position', `${spawnX} 0.1 ${spawnZ}`)

    const randomYRotation = Math.random() * 360
    newElement.setAttribute('rotation', `0 ${randomYRotation} 0`)

    const randomScale = Math.floor(Math.random() * (Math.floor(this.data.max) - Math.ceil(this.data.min)) + Math.ceil(this.data.min))

    newElement.setAttribute('visible', 'false')
    newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

    // newElement.setAttribute('shadow', {
    //   receive: false,
    // })

    newElement.setAttribute('gltf-model', '#almondModel')



    newElement.addEventListener('click', (event) => {
      this.onAlmondSelected(event)
    })
    newElement.addEventListener('touchstart', (event) => {
      this.onAlmondSelected(event)
    })

    this.el.sceneEl.appendChild(newElement)
    newElement.insertAdjacentHTML('beforeend', `
        <a-entity
          id="alphaVideo"
          play-video="video: #alpha-video; autoplay: true"
          material="shader: chromakey; src: #alpha-video; color: 0.1 0.1 0.1; side: double; depthTest: true;"
          geometry="primitive: plane; height: 1.024 width: 1.024;"
          scale="2 1 2"
          rotation="-90 0 0">
        </a-entity>
      `)

    newElement.addEventListener('model-loaded', () => {
      // Once the model is loaded, we are ready to show it popping in using an animation.
      newElement.setAttribute('visible', 'true')
      newElement.setAttribute('animation', {
        property: 'scale',
        to: `${randomScale} ${randomScale} ${randomScale}`,
        easing: 'easeOutElastic',
        dur: 800,
      })
      newElement.setAttribute('class', 'cantap almond')
      // newElement.setAttribute('xrextras-two-finger-rotate', '')
      // newElement.setAttribute('xrextras-pinch-scale', '')
    })
  },
}
