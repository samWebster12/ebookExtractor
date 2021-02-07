const dropDownArrow = document.querySelector('.username');
const dropDownMenu = document.querySelector('.drop-down');

document.addEventListener('click', (e) => {
  console.log(e.target);
  if (
    e.target.classList.contains('username') ||
    e.target.classList.contains('username__name') ||
    e.target.classList.contains('username__dd-arrow')
  ) {
    if (dropDownArrow.classList.contains('open')) {
      dropDownArrow.classList.remove('open');
      dropDownMenu.style.display = 'none';
    } else {
      dropDownMenu.style.display = 'flex';
      dropDownArrow.classList.add('open');
    }
  } else {
    console.log('here');
    if (dropDownArrow.classList.contains('open')) {
      dropDownArrow.classList.remove('open');
      dropDownMenu.style.display = 'none';
    }
  }
});

/*
dropDownArrow.addEventListener('click', () => {
  if (dropDownArrow.classList.contains('open')) {
    dropDownArrow.classList.remove('open');
    dropDownMenu.style.display = 'none';
  } else {
    dropDownMenu.style.display = 'flex';
    dropDownArrow.classList.add('open');
  }
});*/
