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
    li.innerHTML = a.outerHTML;
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
        button.addEventListener('click', (ev) => {
          const expanded = button.parentElement.getAttribute('aria-expanded') === 'true';
          block.querySelectorAll('li[aria-expanded]').forEach((li) => li.setAttribute('aria-expanded', false));
          button.parentElement.setAttribute('aria-expanded', !expanded);
        });
        button.textContent = 'x';
        parent.lastElementChild.prepend(button);
        parent.lastElementChild.append(ul);
        parent = ul;
      }
    }
    parent.append(li);
  });

  window.addEventListener('scroll', () => {
    const rect = document.querySelector('.content').getBoundingClientRect();
    block.classList.toggle('is-sticky', rect.top < 0);
  }, { passive: true });
}
