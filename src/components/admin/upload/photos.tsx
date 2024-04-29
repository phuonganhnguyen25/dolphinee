import React, { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import CameraIcon from "@/components/icons/camera";

export default function UploadPotos() {
  const [photos, setPhotos] = useState<{ src: string }[]>([
    {
      src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
  ]);
  return (
    <>
      <AvatarGroup max={4} isGrid isBordered>
        {photos.map((x, i) => (
          <label key={i}>
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
                <Avatar size="lg" className="cursor-pointer" src={x.src} />
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Popover Content</div>
                  <div className="text-tiny">This is the popover content</div>
                </div>
              </PopoverContent>
            </Popover>
          </label>
        ))}

        {photos.length < 3 ? (
          <label
            className="block w-full cursor-pointer"
            htmlFor="upload_photos"
          >
            <Avatar
              size="lg"
              className="cursor-pointer"
              showFallback
              src="#"
              fallback={<CameraIcon />}
            />
            <input
              accept={"image/*"}
              type="file"
              id="upload_photos"
              className="hidden"
            />
          </label>
        ) : null}
      </AvatarGroup>
    </>
  );
}
