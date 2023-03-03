export default async function decorate(block) {
  let pictures = [...block.querySelectorAll('picture')];
  if (pictures.length < 2) {
    return;
  }

  let mobile, desktop;
  // FIXME: somehw the sorting didn't work…
  // pictures.sort((p1, p2) => {
  //   const img1 = p1.querySelector('img');
  //   const img2 = p2.querySelector('img');
  //   console.log(img1.width, img2.width, Number(img1.width) < Number(img2.width))
  //   return Number(img1.width) < Number(img2.width);
  // });
  // [mobile, desktop] = pictures;

  if (pictures[0].querySelector('img').width < pictures[1].querySelector('img').width) {
    mobile = pictures[0];
    desktop = pictures[1];
  } else {
    mobile = pictures[1];
    desktop = pictures[0];
  }

  const responsivePicture = document.createElement('picture');

  responsivePicture.append(mobile.querySelector('source:not([media])'));
  responsivePicture.append(mobile.querySelector('img'));

  desktop.querySelectorAll('source[media]').forEach((e) => {
    e.setAttribute('media', '(min-width: 600px)');
    responsivePicture.prepend(e);
  });

  pictures.forEach((p) => console.log(p) || p.remove());

  block.firstElementChild.firstElementChild.append(responsivePicture);
}
