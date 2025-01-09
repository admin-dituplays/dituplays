const TELEGRAM_BOT_TOKEN = '6913951592:AAF2IWMZyADnd99mUTsm8rKgJpiW9W-fXp4';
const TELEGRAM_CHAT_ID = '-1002070435205';
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

export const sendFormData = async (form) => {
  // const formAlert = document.querySelector('.tg-form__alert');
  // formAlert.style.display = 'none';

  const { name, phone, product } = Object.fromEntries(new FormData(form).entries());
  const orderMsg = `<b>Нове замовлення:</b> 💸\n\n${product}\n\n🙋‍♂️ <b>Ім'я: </b> ${name}\n\n📱 <b>Телефон: </b> <a href="${phone}">${phone}</a>`;

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: orderMsg,
        parse_mode: 'HTML',
      })
    });

    if (response.ok) {
      window.location.href = 'thank-you.html';
    } else {
      throw new Error(response.statusText)
    }

  } catch (error) {
    // formAlert.style.display = 'block';
    alert("Сталася помилка! Перезавантажте, будь ласка, сторінку та спробуйте знову.");
  }
};