export default async function decorate(block) {
  const main = document.querySelector('main');
  const headings = main.querySelectorAll('h2,h3');
  let parent = document.createElement('ul');
  block.firstElementChild.firstElementChild.append(parent);
  headings.forEach((h) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.innerHTML = h.innerHTML;
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      block.querySelectorAll('li').forEach((li) => li.classList.remove('is-active'));
      ev.target.closest('li').classList.add('is-active');
      document.getElementById(decodeURIComponent(new URL(a.href).hash)).scrollIntoView({ behavior: 'smooth' });
    });
    li.append(a);
    if (h.nodeName === 'H2') {
      li.setAttribute('aria-expanded', false);
      parent = block.firstElementChild.firstElementChild.firstElementChild;
    } else if (h.nodeName === 'H3') {
      if (parent.parentElement.parentElement.parentElement === block) {
        const id = Math.random().toString(32).substring(2);
        const ul = document.createElement('ul');
        ul.id = `menu-${id}`;
        const button = document.createElement('button');
        button.setAttribute('aria-controls', `menu-${id}`);
        button.addEventListener('click', () => {
          const expanded = button.parentElement.getAttribute('aria-expanded') === 'true';
          button.parentElement.setAttribute('aria-expanded', !expanded);
        });
        button.textContent = '';
        parent.lastElementChild.prepend(button);
        parent.lastElementChild.append(ul);
        parent = ul;
      }
    }
    parent.append(li);
  });
  block.querySelectorAll('li[aria-expanded]').forEach((li) => li.setAttribute('aria-expanded', false));
}
