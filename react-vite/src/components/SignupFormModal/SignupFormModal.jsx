import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

export default function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const sessionUser = useSelector(s => s.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Move side effects to useEffect
  useEffect(() => {
    if (sessionUser) {
      closeModal();
      navigate("/videos");
    }
  }, [sessionUser, closeModal, navigate]);

  // Return early if user is logged in
  if (sessionUser) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: "Passwords must match" });
    }

    const result = await dispatch(thunkSignup({ email, username, password }));
    if (result) {
      setErrors(result);
    } else {
      closeModal();
      navigate("/videos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Sign Up</h2>
      {errors.server && <p className="form-error server-error">{errors.server}</p>}
      
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Enter your email address"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>
      
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          placeholder="Choose a username"
          className={errors.username ? 'error' : ''}
        />
        {errors.username && <p className="form-error">{errors.username}</p>}
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Create a password"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>
      
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm your password"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword}</p>
        )}
      </div>
      
      <button type="submit" className="signup-button">Sign Up</button>
    </form>
  );
}