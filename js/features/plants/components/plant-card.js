import {
  describeInterval,
  describeLastWatered,
  hydrationPercent,
  isThirsty,
} from '../rules/plant-care.js';

const DROP_COUNT = 8;

/**
 * Builds the card for one plant. Call update() whenever the plant changes. The same card is
 * updated in place, so the bar can slide and the animations are not restarted.
 */
export function createPlantCard({ onWater }) {
  const element = document.createElement('article');
  element.className = 'card';
  element.innerHTML = `
    <div class="emoji"></div>
    <h2></h2>
    <p class="interval"></p>
    <p class="last-watered"></p>
    <div class="status-row">
      <span class="badge"></span>
      <span class="level"></span>
    </div>
    <div class="meter" role="meter" aria-label="Water level" aria-valuemin="0" aria-valuemax="100">
      <div class="fill"></div>
    </div>
    <button type="button"></button>
  `;

  const part = (selector) => element.querySelector(selector);
  const button = part('button');
  let rain = null;

  button.addEventListener('click', onWater);

  function showRain(show) {
    if (show && !rain) {
      rain = document.createElement('div');
      rain.className = 'card-rain';
      rain.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < DROP_COUNT; i++) {
        const drop = document.createElement('i');
        drop.style.setProperty('--i', i);
        rain.append(drop);
      }
      element.prepend(rain);
    } else if (!show && rain) {
      rain.remove();
      rain = null;
    }
  }

  function update(plant, { watering, disabled }) {
    const thirsty = isThirsty(plant);
    const hydration = hydrationPercent(plant);

    element.classList.toggle('thirsty', thirsty);
    element.classList.toggle('watering', watering);
    showRain(watering);

    part('.emoji').textContent = plant.emoji;
    part('h2').textContent = plant.name;
    part('.interval').textContent = describeInterval(plant);
    part('.last-watered').textContent = describeLastWatered(plant);
    part('.badge').textContent = thirsty ? 'Thirsty' : 'Happy';
    part('.level').textContent = `${hydration}% watered`;
    part('.meter').setAttribute('aria-valuenow', hydration);
    part('.fill').style.width = `${hydration}%`;
    button.disabled = disabled;
    button.textContent = watering ? 'Watering…' : 'Water now';
  }

  return { element, update };
}
