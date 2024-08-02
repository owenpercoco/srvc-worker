import { BaseProduct } from '@/data/inventory';
import { Dispatch, SetStateAction } from 'react';


interface modalProps {
    show: boolean;
    product?: BaseProduct;
    setShowModal: Dispatch<SetStateAction<boolean>>
}


const priceDisplay = (priceValue: number | number[]): string => {
    let displayString = ''
    let displayAmounts = ['⅛', '¼', '½', 'oz']
    if (typeof priceValue === "number") {
        displayString = `$${priceValue}`
    } else if (Array.isArray(priceValue)) {
        displayString = priceValue.map((val, index) => `$${val} ${displayAmounts[index]}`).join(" • ");
    }
    return displayString;
}

const Modal = ({show, product, setShowModal}: modalProps) => {
    if (!show || product === undefined) return <div></div>
    let price = product.price || []
    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className='modal-row'>
                    <div className="modal-header">
                        <h2>{product.name}</h2>
                        <span onClick={() => setShowModal(false)}className="close">&times;</span>
                    </div>
                </div>
                <div className='modal-row'>
                    <span className="modal-text">{product.type}</span>
                </div>
                <div className="modal-row price-row">
                    <span className="modal-prices">{priceDisplay(price)}</span>
                    <span className='modal-amount'>{product.amount}</span>
                </div>
                <div className='modal-row'>
                    <span className="modal-text">{product.description}</span>
                </div>
            </div>
        </div>
    );
}

export default Modal;
