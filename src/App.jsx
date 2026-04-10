import { useEffect, useMemo, useState } from 'react'
import './App.css'

const OFFER_FEED_URL =
  'https://d2dzcaq3bhqk1m.cloudfront.net/public/offers/feed.php?user_id=623910&api_key=525aedb31fa76c26997f25d2b15e501f&s1=&s2='
const IOS_OFFER_ID = '15029'
const ANDROID_OFFER_ID = '18091'

const steps = [
  'Sign up for free',
  'Do simple online tasks',
  'Earn SB points',
  'Redeem SB for PayPal cash or gift cards',
]

const ways = [
  'Answer surveys',
  'Play games',
  'Shop online (cashback)',
  'Watch videos',
  'Search the web',
  'Upload receipts',
]

const reviewImages = [
  {
    src: '/reviews/review-1.webp',
    alt: 'Swagbucks review screenshot 1',
  },
  {
    src: '/reviews/review-2.webp',
    alt: 'Swagbucks review screenshot 2',
  },
  {
    src: '/reviews/review-3.webp',
    alt: 'Swagbucks review screenshot 3',
  },
]

const reviews = [
  {
    name: 'Jessica Osborne',
    date: 'March 1, 2026',
    avatar: '/avatars/jessica.webp',
    text:
      "This is one of my favorite apps to earn a little extra money. I haven't played any of the games yet; I mostly just do the daily poll, trivia, and surveys. The cash out process isn't too difficult; just make sure that the last screen shows a smiley face and tells you that's processing. I have only cashed out for a Walmart gift card and PayPal, and neither one took more than 2 days. If you cash out during the weekend or on a holiday it will take longer. Also, you get a little gift for your b-day.",
  },
  {
    name: 'Brandon J. Tindle',
    date: 'April 4, 2026',
    avatar: '/avatars/brandon.webp',
    text:
      "If there were a way to rate this phenomenal app 10 golden stars it would be a done deal as far as I'm concerned. Read on, y'all. Please and thank you kindly. This is the number one most fun-filled app out there. I have been a Swagger for the past couple of years off and on, and it by far takes the cake. If you are thinking about downloading one of those money-making apps, this would be my first choice most definitely.",
  },
]

const highlights = [
  {
    title: 'Free to start',
    text: 'Create your account in minutes and jump in.',
  },
  {
    title: 'Quick tasks',
    text: 'Short surveys, games, and offers fit small breaks.',
  },
  {
    title: 'Real rewards',
    text: 'Turn SB points into PayPal cash or gift cards.',
  },
]

function jsonp(url, { timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    const separator = url.includes('?') ? '&' : '?'
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('Request timed out'))
    }, timeout)

    function cleanup() {
      clearTimeout(timer)
      delete window[callbackName]
      script.remove()
    }

    window[callbackName] = (data) => {
      cleanup()
      resolve(data)
    }

    script.src = `${url}${separator}callback=${callbackName}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Request failed'))
    }

    document.body.appendChild(script)
  })
}

function App() {
  const [offers, setOffers] = useState([])
  const [isDesktop, setIsDesktop] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(10 * 60)

  useEffect(() => {
    let active = true

    jsonp(OFFER_FEED_URL)
      .then((data) => {
        if (!active) return
        setOffers(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!active) return
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (min-width: 769px)')
    const update = () => setIsDesktop(media.matches)
    update()
    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }
    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const { iosOffer, androidOffer } = useMemo(() => {
    const ios = offers.find((offer) => String(offer.id) === IOS_OFFER_ID)
    const android = offers.find((offer) => String(offer.id) === ANDROID_OFFER_ID)
    return { iosOffer: ios, androidOffer: android }
  }, [offers])

  const getInitials = (name) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  if (isDesktop) {
    return (
      <div className="page desktop-lock">
        <div className="orb orb-one" aria-hidden="true"></div>
        <div className="orb orb-two" aria-hidden="true"></div>
        <div className="orb orb-three" aria-hidden="true"></div>

        <main className="card desktop-card">
          <img
            src="/SWAGBUCKBLUEWITHTHEXT.png"
            alt="Swagbucks"
            className="logo"
          />
          <p className="eyebrow">Mobile only</p>
          <h1>Open this page on your phone.</h1>
          <p className="subtext">
            This promo is available on mobile devices only. Please visit this
            page on your phone to see the live offers.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="orb orb-one" aria-hidden="true"></div>
      <div className="orb orb-two" aria-hidden="true"></div>
      <div className="orb orb-three" aria-hidden="true"></div>

      <main className="phone-shell">
        <header className="nav">
          <img
            src="/SWAGBUCKBLUEWITHTHEXT.png"
            alt="Swagbucks"
            className="logo"
          />
        </header>

        <section className="card timer-bar">
          <div className="timer-left">
            <span className="timer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                <path d="M9 2h6v2H9zM12 6a8 8 0 108 8 8.01 8.01 0 00-8-8zm0 14a6 6 0 116-6 6.01 6.01 0 01-6 6zm-.5-9h1.5v4.25l3 1.8-.75 1.23-3.75-2.3z" />
              </svg>
            </span>
            <div>
              <p className="timer-label">Limited offer ends in</p>
            </div>
          </div>
          <div className="timer-right">
            <p className="timer-count">
              {secondsLeft > 0 ? formatTime(secondsLeft) : 'Ended'}
            </p>
            <p className="timer-caption">Download quick</p>
          </div>
        </section>

        <section className="hero card hero-boost hero-attach">
          <p className="eyebrow">Swagbucks Download</p>
          <h1 className="hero-title">
            <span className="hero-accent">Download</span> and start earning today
            with <span className="hero-accent-alt">Swagbucks</span>.
          </h1>
          <p className="subtext">
            Swagbucks is a free rewards app where you do quick tasks, earn SB
            points, and trade them for PayPal cash or gift cards.
          </p>
          <div className="cta-group">
            {iosOffer ? (
              <a
                id="install"
                className="cta primary"
                href={iosOffer.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="cta-os" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M16.6 3.6c-.9.8-2 1.1-3 .9-.1-1 .4-2 1.1-2.7.7-.7 1.8-1.1 2.7-1.1-.1 1-.4 1.9-.8 2.9z" />
                    <path d="M12.1 6.1c1.3 0 2.3.7 3.1.7.8 0 1.4-.7 2.5-.7 1 0 2 .6 2.6 1.5-2.2 1.3-1.9 4.4.4 5.4-.4 1.1-1.2 2.2-1.9 3.1-.7.9-1.5 1.9-2.6 1.9-.7 0-1.2-.2-1.8-.4-.5-.2-1-.4-1.6-.4-.6 0-1.1.2-1.7.4-.6.2-1.1.4-1.8.4-1.2 0-2-1-2.7-2-1.3-1.9-2.3-5.2-.8-7.2.6-.8 1.6-1.6 2.9-1.6 1 0 2 .7 2.7.7z" />
                  </svg>
                </span>
                <span className="cta-label">
                  <span className="cta-download" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3a1 1 0 011 1v8.59l2.3-2.3a1 1 0 111.4 1.42l-4.01 4.01a1 1 0 01-1.38 0l-4.01-4.01a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zm-7 14a1 1 0 011 1v2h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                    </svg>
                  </span>
                  Get on iPhone / iPad
                </span>
              </a>
            ) : (
              <button className="cta primary disabled" disabled>
                <span className="cta-os" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M16.6 3.6c-.9.8-2 1.1-3 .9-.1-1 .4-2 1.1-2.7.7-.7 1.8-1.1 2.7-1.1-.1 1-.4 1.9-.8 2.9z" />
                    <path d="M12.1 6.1c1.3 0 2.3.7 3.1.7.8 0 1.4-.7 2.5-.7 1 0 2 .6 2.6 1.5-2.2 1.3-1.9 4.4.4 5.4-.4 1.1-1.2 2.2-1.9 3.1-.7.9-1.5 1.9-2.6 1.9-.7 0-1.2-.2-1.8-.4-.5-.2-1-.4-1.6-.4-.6 0-1.1.2-1.7.4-.6.2-1.1.4-1.8.4-1.2 0-2-1-2.7-2-1.3-1.9-2.3-5.2-.8-7.2.6-.8 1.6-1.6 2.9-1.6 1 0 2 .7 2.7.7z" />
                  </svg>
                </span>
                <span className="cta-label">
                  <span className="cta-download" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3a1 1 0 011 1v8.59l2.3-2.3a1 1 0 111.4 1.42l-4.01 4.01a1 1 0 01-1.38 0l-4.01-4.01a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zm-7 14a1 1 0 011 1v2h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                    </svg>
                  </span>
                  Get on iPhone / iPad
                </span>
              </button>
            )}
            {androidOffer ? (
              <a
                className="cta ghost"
                href={androidOffer.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="cta-os" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="5" y="7" width="14" height="11" rx="2.5" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <path d="M8 5l-1.5-1.5M16 5l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                <span className="cta-label">
                  <span className="cta-download" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3a1 1 0 011 1v8.59l2.3-2.3a1 1 0 111.4 1.42l-4.01 4.01a1 1 0 01-1.38 0l-4.01-4.01a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zm-7 14a1 1 0 011 1v2h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                    </svg>
                  </span>
                  Get on Android
                </span>
              </a>
            ) : (
              <button className="cta ghost disabled" disabled>
                <span className="cta-os" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="5" y="7" width="14" height="11" rx="2.5" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <path d="M8 5l-1.5-1.5M16 5l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                <span className="cta-label">
                  <span className="cta-download" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3a1 1 0 011 1v8.59l2.3-2.3a1 1 0 111.4 1.42l-4.01 4.01a1 1 0 01-1.38 0l-4.01-4.01a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zm-7 14a1 1 0 011 1v2h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                    </svg>
                  </span>
                  Get on Android
                </span>
              </button>
            )}
          </div>
          <p className="fineprint">
            Offers are US-only. If the buttons are disabled, the offer is not
            available for your location or device yet.
          </p>
        </section>

        <section className="promo card promo-hero promo-slim">
          <div className="promo-top">
            <div>
              <p className="eyebrow">Limited promo</p>
              <h2>$10 game promo</h2>
            </div>
            <span className="pill">Play to earn</span>
          </div>
          <p>
            Play 2 games for 5 minutes each to receive the $10 promotion.
          </p>
          <div className="promo-alert">
            <span>Expires in 10 minutes</span>
            <span className="divider">•</span>
            <span>Download quick</span>
          </div>
        </section>

        <section className="card reviews">
          <div className="carousel">
            <div className="carousel-track auto">
              {[...reviewImages, ...reviewImages].map((image, index) => (
                <div className="carousel-slide" key={`${image.src}-${index}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="carousel-image"
                    loading={index < reviewImages.length ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card highlight">
          <div className="highlight-header">
            <p className="eyebrow">Why it works</p>
            <h2>Small tasks, real rewards.</h2>
          </div>
          <div className="highlight-grid">
            {highlights.map((item) => (
              <div key={item.title} className="mini-card">
                <p className="mini-title">{item.title}</p>
                <p className="fineprint">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>How it works</h2>
          <ul className="steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Ways to earn</h2>
          <div className="chips">
            {ways.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="card reviews">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2>What people say on Google Play</h2>
          </div>
          <div className="review-list">
            {reviews.map((review) => (
              <div key={`${review.name}-${review.date}`} className="review-card">
                <div className="review-top">
                  <div className="review-left">
                    <div className="avatar">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.name} />
                      ) : (
                        <span>{getInitials(review.name)}</span>
                      )}
                    </div>
                    <div>
                      <p className="review-name">{review.name}</p>
                      <div className="stars" aria-label="5 star rating">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={`${review.name}-star-${index}`}
                            viewBox="0 0 24 24"
                            className="star"
                            aria-hidden="true"
                          >
                            <path d="M12 17.27l-5.18 3.2 1.41-5.99L3 9.75l6.07-.52L12 3.5l2.93 5.73 6.07.52-5.23 4.73 1.41 5.99z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-date">{review.date}</p>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        <a href="#install" className="sticky-install" aria-label="Install now">
          Install now
        </a>

        <div className="legal">
          <a href="/privacy.html">Privacy Policy</a>
        </div>

      </main>
    </div>
  )
}

export default App
