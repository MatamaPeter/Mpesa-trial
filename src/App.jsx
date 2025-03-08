import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ phone: '', amount: '' });

  // ✅ Validate Phone Number
  const validatePhone = (number) => {
    const phoneRegex = /^(2547\d{8})$/;
    if (!phoneRegex.test(number)) {
      setErrors((prev) => ({ ...prev, phone: '❌ Enter a valid Kenyan phone number (2547XXXXXXXX)' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: '' }));
    return true;
  };

  // ✅ Validate Amount
  const validateAmount = (amt) => {
    if (amt <= 0) {
      setErrors((prev) => ({ ...prev, amount: '❌ Amount must be greater than zero.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: '' }));
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validatePhone(phone) || !validateAmount(amount)) return;

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/initiate-payment`, { phone, amount });
      setMessage('✅ Payment initiated successfully. Check your phone to complete the payment.');
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || 'Server is unreachable'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>M-Pesa Payment</h1>
      <form onSubmit={handlePayment}>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              validatePhone(e.target.value);
            }}
            placeholder="2547XXXXXXXX"
            required
          />
          {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validateAmount(e.target.value);
            }}
            placeholder="100"
            min="1"
            required
          />
          {errors.amount && <p style={{ color: 'red' }}>{errors.amount}</p>}
        </div>
        <button type="submit" disabled={loading || errors.phone || errors.amount}>
          {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
      </form>
      {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default PaymentForm;
