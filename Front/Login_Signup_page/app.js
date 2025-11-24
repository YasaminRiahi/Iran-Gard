const wrapper = document.getElementById('wrapper');
const loginPanel = document.getElementById('loginPanel');
const signupPanel = document.getElementById('signupPanel');

document.getElementById('signupTrigger').addEventListener('click', () => {
    wrapper.classList.add('show-signup');
    loginPanel.classList.remove('active');
    setTimeout(() => signupPanel.classList.add('active'), 100);
});

document.getElementById('loginTrigger').addEventListener('click', () => {
    wrapper.classList.remove('show-signup');
    signupPanel.classList.remove('active');
    setTimeout(() => loginPanel.classList.add('active'), 100);
});