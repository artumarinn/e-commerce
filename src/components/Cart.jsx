import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import { Trash } from "react-bootstrap-icons";
import "/src/assets/styles/Cart.css";
import { getCartProductsThunk, removeCartProductThunk, updateCartProductThunk } from "/src/store/slices/cartProducts.slice";

function Cart({ sendLaunch, launch }) {
    const [total, setTotal] = useState(0);
    const [preferenceId, setPreferenceId] = useState(null);
    const cartProducts = useSelector(state => state.cartProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCartProductsThunk());
    }, []);

    useEffect(() => {
        setTotal(cartProducts.reduce((acc, product) => 
            acc + (Number(product.price) * product.productsInCart.quantity), 0
        ));
    }, [cartProducts]);

    const handleCheckout = async () => {
        try {
            const orderData = cartProducts.map(product => ({
                title: product.title,
                quantity: product.productsInCart.quantity,
                unit_price: Number(product.price),
            }));

            const response = await axios.post("http://localhost:3001/api/create_preference", {
                items: orderData,
            });

            const { id } = response.data;
            setPreferenceId(id);
            renderMercadoPagoButton(id);
        } catch (error) {
            console.error("Error creating preference:", error);
            alert("Failed to create payment preference");
        }
    };

    const renderMercadoPagoButton = (preferenceId) => {
        const mp = new MercadoPago(process.env.PUBLIC_KEY, {
            locale: "es-AR",
        });

        const bricksBuilder = mp.bricks();

        const renderComponent = async () => {
            if (window.wallet) window.wallet.unmount();
            window.wallet = await bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId,
                },
                customization: {
                    texts: {
                        valueProp: "smart_option",
                    },
                },
            });
        };

        renderComponent();
    };

    return (
        <Offcanvas show={launch} onHide={() => sendLaunch(false)} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup variant="flush">
                    {cartProducts.map((product, index) => (
                        <ListGroup.Item key={index}>
                            <span>{product.productsInCart.quantity}</span>
                            <div>
                                <span>{product.title}</span>
                                <span>{`$${product.price}`}</span>
                                <Trash onClick={() => dispatch(removeCartProductThunk(product.id))} />
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div>
                    <span>Total:</span>
                    <span>{`$${total}`}</span>
                </div>
                <Button variant="primary" onClick={handleCheckout}>Buy</Button>
                <div id="wallet_container"></div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default Cart;
