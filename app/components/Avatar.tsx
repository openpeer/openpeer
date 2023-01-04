interface AvatarProps {
  image: string
}

const Avatar = ({ image }: AvatarProps) => {
  return (
    <span className="relative inline-block">
      <img className="h-8 w-8 md:h-10 md:w-10 rounded-full" src={image} />
    </span>
  )
}

export default Avatar
