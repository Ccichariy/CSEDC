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
      setErrors(Array.isArray(result) ? result : [result]);
    } else {
      closeModal();
      navigate("/videos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      {errors.map((err, i) => (
        <p key={i} className="form-error">{err}</p>
      ))}
      <label>
        Username or Email
        <input
          value={credential}
          onChange={e => setCredential(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}