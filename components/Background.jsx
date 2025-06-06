import Image from 'next/image';
import styles from './Background.module.css';

const Background = ({ heroCount }) => {
  const images = [
    '/assets/Back1.webp',
    '/assets/Back2.webp',
    '/assets/Back3.webp'
  ];

  const currentImage = images[heroCount] || null;
  if (!currentImage) return null;

  return (
    <div className={styles.background}>
      <Image
        src={currentImage}
        alt="Hero Background"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default Background;
