const mp = new MercadoPago(process.env.PUBLIC_KEY, {
    locale:"es-AR",
});

document.getElementById("cart-checkout").addEventListener("click", async () => {
    try{
      const orderData = {
          title: "PC",
          quanty: 1,
          prince: 100,
      };      
      const response = await fetch("http://localhost:3001/api/create_preference", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
      });      
      const preference = await response.json();
      createCheckoutButton(preference.id);
    } catch(error){
        alert("Error al crear la preferencia");
    }
});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.createCheckoutButton) window.checkoutButton, unmount();
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        customization: {
          texts: {
           valueProp: 'smart_option',
          },
        },
        });
    }

    renderComponent();
};