export default function Header({ onLogoClick, lastUpdatedLabel }) {
  return (
    <>
      <div className="top">
        <div className="logo-wrap">
          <div className="confetti">
            <span style={{ width: 9, height: 9, background: '#00B889', top: 0, left: -2, borderRadius: 3, transform: 'rotate(20deg)' }} />
            <span style={{ width: 7, height: 7, background: '#E11D48', top: -4, right: 6 }} />
            <span style={{ width: 8, height: 8, background: '#FFC107', bottom: 0, left: 2, borderRadius: 3, transform: 'rotate(-15deg)' }} />
            <span style={{ width: 6, height: 6, background: '#9B4DFF', top: 8, right: -6 }} />
          </div>
          <div className="logo-mark" onClick={onLogoClick}>
            <span style={{ background: '#3E5FFF' }} />
            <span style={{ background: '#E11D48' }} />
            <span style={{ background: '#FFC107' }} />
            <span style={{ background: '#00B889' }} />
          </div>
        </div>
        <h1 onClick={onLogoClick}>Currents</h1>
      </div>
      <div className="updated-pill">
        <span className="pulse" />
        {lastUpdatedLabel}
      </div>
    </>
  );
}
