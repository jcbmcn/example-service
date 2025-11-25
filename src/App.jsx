import { useEffect, useState } from 'react';

const colorToEndpoint = {
  blue: '/blue',
  green: '/green',
};

export default function App() {
  const [color, setColor] = useState('blue');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Fetching version...');

  useEffect(() => {
    fetch('/version')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Version check failed with status ${res.status}`);
        }
        const payload = await res.json();
        const detectedColor = typeof payload === 'string' ? payload : payload.version || payload.color;
        if (detectedColor === 'green' || detectedColor === 'blue') {
          setColor(detectedColor);
          setStatus('ready');
          setMessage(`This container advertises the ${detectedColor} build.`);
        } else {
          throw new Error('Unexpected version payload');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, []);

  const endpoint = colorToEndpoint[color];

  return (
    <div className="page">
      <header className="hero">
        <h1>Supernova Demo</h1>
        <p>Build-aware React app showing the packaged supernova.</p>
      </header>

      <section className={`card ${color}`}>
        <div className="meta">
          <p className="label">Image tag</p>
          <p className="value">{color}</p>
          <p className={`pill ${status}`}>{status}</p>
          <p className="message">{message}</p>
        </div>

        <div className="image-frame">
          {status === 'error' ? (
            <div className="error">Unable to resolve image endpoint.</div>
          ) : (
            <img src={endpoint} alt={`${color} supernova`} />
          )}
        </div>
      </section>

      <footer className="footer">
        <p>Endpoints: /{color} &middot; /health &middot; /version</p>
      </footer>
    </div>
  );
}
