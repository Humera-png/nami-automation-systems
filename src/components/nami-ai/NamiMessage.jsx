export default function NamiMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`nami-message ${isUser ? 'nami-message--user' : 'nami-message--assistant'}`}>
      {!isUser && <span className="nami-message__avatar" aria-hidden="true" />}
      <p className="nami-message__bubble">{content}</p>
    </div>
  );
}
