const sendToManager = async (form) => {
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    product: formData.get('product'),
    price: formData.get('price'),
  };

  try {
    const response = await fetch('https://order-manager-bot.vercel.app/api/form-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // window.location.href = 'thank-you.html';
      console.log('thank you');
    } else {
      console.error('Error sending data');
      throw new Error(response.statusText)
    }
  } catch (error) {
    console.error('Network error:', error);
    // alert("Сталася помилка! Перезавантажте, будь ласка, сторінку та спробуйте знову.");
  }
}

export default sendToManager;