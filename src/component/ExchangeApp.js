import React,{ useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExchangeAlt, faCloudArrowUp, faCat} from '@fortawesome/free-solid-svg-icons';
import { Animated } from 'react-animated-css';
import './ExchangeApp.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function ExchangeRatesApp() {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [currencies, setCurrencies] = useState([]);
    const [exchangeRate, setExchangeRate] = useState();
    const [convertedAmount, setConvertedAmount] = useState();
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [showPersonal, setShowPersonal] = useState(false);
    const containerRef = useRef(null);


    useEffect(() => {
        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);
        return () => {
            window.removeEventListener('resize', updateContainerHeight);
        };
    }, [transactionHistory]);

    const updateContainerHeight = () => {
        const container = containerRef.current;
        if (container) {
            const contentHeight = container.scrollHeight;
            const extraHeight = 30;
            container.style.minHeight = `${contentHeight + extraHeight}px`;
        }
    };


    useEffect(() => {
        axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(res => {
                setCurrencies(Object.keys(res.data.rates));
                setExchangeRate(res.data.rates[toCurrency]);
            })
            .catch(error => console.log(error));
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        if (exchangeRate) {
            setConvertedAmount((amount * exchangeRate).toFixed(2));
            setShowPersonal(amount === 2023 || amount === 100);
        }
    }, [amount, exchangeRate]);




    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    };

    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    };

    const handleExchangeCurrency = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };


    const handleBuyClick = async () => {
        try {
            const response = await axios.post(
                'https://jsonplaceholder.typicode.com/comments',
                {
                    name: 'Popescu Ion',
                    email: 'popescuion@gmail.com',
                    body: `Bought ${amount} ${fromCurrency} for ${convertedAmount} ${toCurrency}`,
                }
            );
            const transaction = {
                id: response.data.id,
                amount: amount,
                fromCurrency: fromCurrency,
                convertedAmount: convertedAmount,
                toCurrency: toCurrency,
            };
            setTransactionHistory([...transactionHistory, transaction]);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div ref={containerRef} className="container d-flex flex-column align-items-center justify-content-center vh-100 border shadow">
            <header className="d-flex flex-column align-items-center justify-content-center py-3">
                <h1>Currency Exchange</h1>
                <p>Calculate and convert currencies</p>
            </header>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="fromCurrency">From:</label>
                        <select className="form-control custom-select" id="fromCurrency" value={fromCurrency} onChange={handleFromCurrencyChange}>
                            {currencies.map((currency,index) => (
                                <option key={index} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
                <div className="col d-flex align-items-center justify-content-center">
                    <div className="bg-primary rounded-circle p-2 m-2 custom-select clickable" onClick={handleExchangeCurrency}>
                        <FontAwesomeIcon icon={faExchangeAlt} className="text-white" />
                    </div>

                </div>
                <div className="col">
                    <div className="form-group ">
                        <label htmlFor="toCurrency">To:</label>
                        <select className="form-control custom-select" id="toCurrency" value={toCurrency} onChange={handleToCurrencyChange}>
                            {currencies.map((currency,index) => (
                                <option key={index} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>Exchange Rate: {exchangeRate}</div>
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input type="number" className="form-control custom-select" id="amount" value={amount} onChange={handleAmountChange} />
            </div>

            {convertedAmount && (
                <div>
                    Converted Amount: {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                </div>
            )}

            <div className="cloud">
                <Animated animationIn="zoomIn" animationOut="zoomOut" isVisible={showPersonal}>
                    <div>
                        {amount === '2023' && (
                            <FontAwesomeIcon icon={faCloudArrowUp} size="2x" color="blue" />
                        )}
                        {amount === '100' && (
                            <FontAwesomeIcon icon={faCat} size = "2x" color="black"/>
                        )}
                    </div>
                </Animated>
            </div>

            <button className="btn btn-primary mt-3 custom-button" onClick={handleBuyClick}>
                Buy
            </button>
            <div  className="list-group">
                {transactionHistory.length > 0 && (
                    <div>
                        <h2>Transaction History</h2>
                        <ul className="list-group">
                            {transactionHistory.map((transaction) => (
                                <li key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    Bought {transaction.amount} {transaction.fromCurrency} for {transaction.convertedAmount} {transaction.toCurrency}
                                </li>
                            ))}
                        </ul>
                    </div>

                )}
            </div>
        </div>
    );

}

export default ExchangeRatesApp;
