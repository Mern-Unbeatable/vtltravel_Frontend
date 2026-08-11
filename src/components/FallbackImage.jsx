import { useEffect, useState } from 'react'
import dummyImage from '../assets/images/dummy-image-square.png'

export const DUMMY_IMAGE = dummyImage

const FallbackImage = ({ src, alt = '', className = '', dummyClassName = '' }) => {
  const [failed, setFailed] = useState(false)
  const hasSrc = Boolean(src)
  const showDummy = !hasSrc || failed

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <img
      src={showDummy ? DUMMY_IMAGE : src}
      alt={alt}
      onError={() => {
        if (!failed) setFailed(true)
      }}
      className={showDummy ? dummyClassName || className : className}
    />
  )
}

export default FallbackImage
