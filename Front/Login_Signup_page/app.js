const signupTrigger = document.getElementById('signupTrigger');
const loginTrigger = document.getElementById('loginTrigger');
const wrapper = document.getElementById('wrapper');
const loginPanel = document.getElementById('loginPanel');
const signupPanel = document.getElementById('signupPanel');

signupTrigger.addEventListener('click', () => {
    wrapper.classList.add('show-signup');
    loginPanel.classList.remove('active');
    signupPanel.classList.add('active');
});

loginTrigger.addEventListener('click', () => {
    wrapper.classList.remove('show-signup');
    signupPanel.classList.remove('active');
    loginPanel.classList.add('active');
});
