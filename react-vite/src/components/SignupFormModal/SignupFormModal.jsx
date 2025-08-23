import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

export default function SignupFormModal() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { closeModal } = useModal();
  const sessionUser = useSelector(s => s.session.user);

  const [email, setEmail]               = useState("");
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors]             = useState({});

  if (sessionUser) {
    closeModal();
    navigate("/videos");
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
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {errors.server && <p className="form-error">{errors.server}</p>}
      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      {errors.email && <p className="form-error">{errors.email}</p>}
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </label>
      {errors.username && <p className="form-error">{errors.username}</p>}
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      {errors.password && <p className="form-error">{errors.password}</p>}
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      {errors.confirmPassword && (
        <p className="form-error">{errors.confirmPassword}</p>
      )}
      <button type="submit">Sign Up</button>
    </form>
  );
}