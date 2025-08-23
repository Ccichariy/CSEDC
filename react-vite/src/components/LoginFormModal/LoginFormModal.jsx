import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import { useModal } from "../../context/Modal"; // <-- import useModal
import "./LoginForm.css";

export default function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal(); // <-- get closeModal
  const sessionUser = useSelector((s) => s.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    closeModal();
    navigate("/videos");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const result = await dispatch(thunkLogin({ credential, password }));
    if (result) {
      // Handle error object with server key
      if (result.server) {
        setErrors([result.server]);
      } else {
        setErrors(Array.isArray(result) ? result : [result]);
      }
    } else {
      closeModal();
      navigate("/videos");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    const result = await dispatch(thunkLogin({ 
      credential: "Demo", 
      password: "password" 
    }));
    if (result) {
      // Handle error - login failed
      if (result.server) {
        setErrors([result.server]);
      } else {
        setErrors(Array.isArray(result) ? result : [result]);
      }
    } else {
      closeModal();
      navigate("/videos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Log In</h2>
      {errors.map((err, i) => (
        <p key={i} className="form-error">{err}</p>
      ))}
      <div className="form-group">
        <label>Username or Email</label>
        <input
          type="text"
          value={credential}
          onChange={e => setCredential(e.target.value)}
          required
          placeholder="Enter your username or email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </div>
      <div className="button-group">
        <button type="submit" className="login-button">Log In</button>
        <button type="button" onClick={handleDemoLogin} className="demo-button">Demo User</button>
      </div>
    </form>
  );
}