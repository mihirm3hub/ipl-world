import { benefitMessages } from './lib/benefitMessages'

const matchRewardMessages = [
  {
    title: 'Bone Strength Unlocked',
    description: 'Almonds have Calcium that helps keep your bones strong for epic shots.',
  },
  {
    title: 'Muscle Strength Unlocked',
    description: 'Almonds have Protein that helps build and preserve muscles for epic shots.',
  },
  {
    title: 'Muscle Strength Unlocked',
    description: 'Almonds have Protein that helps build and preserve muscles for epic catches.',
  },
  {
    title: 'Sustained Energy Unlocked',
    description: 'Almonds have Magnesium and B vitamins that help in sustaining energy for long innings.',
  },
  {
    title: 'Bone Strength Unlocked',
    description: 'Almonds have Calcium that helps keep your bones strong for epic shots.',
  },
  {
    title: 'Muscle Strength Unlocked',
    description: 'Almonds have Protein that helps build and preserve muscles for epic shots.',
  },
  {
    title: 'Heart Health Unlocked',
    description: 'Almonds have Good Fats that help keep the heart healthy to keep running between the wickets.',
  },
  {
    title: 'Calm Nerves Unlocked',
    description: 'Almonds have Magnesium that helps the body manage stressful moments like the last over.',
  },
  {
    title: 'Sustained Energy Unlocked',
    description: 'Almonds have Magnesium and B vitamins that help in sustaining energy for long innings.',
  },
  {
    title: 'Calm Nerves Unlocked',
    description: 'Almonds have Magnesium that helps the body manage stressful moments like waiting for a DRS result.',
  },
  {
    title: 'Heart Health Unlocked',
    description: 'Almonds have Good Fats that help keep the heart healthy to keep running between the wickets.',
  },
  {
    title: 'Sustained Energy Unlocked',
    description: 'Almonds have Magnesium and B vitamins that help in sustaining energy for long innings.',
  },
  {
    title: 'Heart Health Unlocked',
    description: 'Almonds have Good Fats that help keep the heart healthy to keep running between the wickets.',
  },
  {
    title: 'Sustained Energy Unlocked',
    description: 'Almonds have Magnesium and B vitamins that help in sustaining energy for long innings.',
  },
]

const normalizeBenefitKey = (value) =>
  String(value || '')
    .replace(/\s+unlocked$/i, '')
    .trim()
    .toUpperCase()

const matchRewardTitleKeys = new Set(
  matchRewardMessages.map((message) => normalizeBenefitKey(message.title)),
)

const idleRewardMessages = benefitMessages.filter(
  (message) => !matchRewardTitleKeys.has(normalizeBenefitKey(message.title)),
)

const initLookAroundToggle = () => {
  const lookText = document.querySelector('.look-text')
  const arrowZones = document.querySelectorAll('.arrow-zone')
  const pointingIcon = document.querySelector('.pointing-icon')

  if (!lookText || arrowZones.length === 0) return

  const setLookAroundState = (showLookAround) => {
    lookText.classList.toggle('show-lookaround', showLookAround)
    if (pointingIcon) {
      pointingIcon.src = showLookAround
        ? './assets/images/camera.png'
        : './assets/images/pointing.png'
    }
  }

  const toggleHint = () => {
    const isShowingLookAround = lookText.classList.contains('show-lookaround')
    setLookAroundState(!isShowingLookAround)
  }

  const onKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleHint()
    }
  }

  arrowZones.forEach((zone) => {
    zone.addEventListener('click', toggleHint)
    zone.addEventListener('keydown', onKeydown)
  })

  // Start with the default single-line instruction visible.
  setLookAroundState(false)
}

const initRewardPopupContent = () => {
  const popupPointsText = document.getElementById('rewardPointsText')
  const popupTitle = document.getElementById('rewardTitle')
  const popupDesc = document.getElementById('rewardDesc')

  let matchRewardIndex = -1
  let idleRewardIndex = -1

  const getNextMessage = (points) => {
    const isMatchReward = Number(points) >= 50
    const rewardMessages = isMatchReward ? matchRewardMessages : idleRewardMessages

    if (!Array.isArray(rewardMessages) || rewardMessages.length === 0) {
      return null
    }

    if (isMatchReward) {
      matchRewardIndex = (matchRewardIndex + 1) % rewardMessages.length
      return rewardMessages[matchRewardIndex]
    }

    idleRewardIndex = (idleRewardIndex + 1) % rewardMessages.length
    return rewardMessages[idleRewardIndex]
  }

  window.updateRewardPopupContent = (points) => {
    const safePoints = Number(points) >= 50 ? 50 : 10
    const nextMessage = getNextMessage(points)

    if (popupPointsText) {
      popupPointsText.textContent = `${safePoints} POINTS`
    }

    if (popupTitle && nextMessage?.title) {
      popupTitle.textContent = nextMessage.title
    }

    if (popupDesc && nextMessage?.description) {
      popupDesc.textContent = nextMessage.description
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initLookAroundToggle()
  initRewardPopupContent()
})
