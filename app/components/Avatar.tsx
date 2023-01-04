interface AvatarProps {
  size: string
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  status: boolean
}

const Avatar = ({ size, image, status }: AvatarProps) => {
  return (
    <span className="relative inline-block">
      {size == 8 ? (
        <img className="h-8 w-8 rounded-full" src={image} />
      ) : (
        <img className="h-16 w-16 rounded-full" src={image} />
      )}
      {status ? (
        <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-green-400 ring-2 ring-white" />
      ) : (
        <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-gray-300 ring-2 ring-white" />
      )}
    </span>
  )
}

export default Avatar
