import {
  CameraIcon,
  ContactIcon,
  DocumentIcon,
  PollIcon,
  StickerIcon,
} from "../../../../../svg";
import DocumentAttachment from "./DocumentAttachment";
import PhotoAttachment from "./PhotoAttachment";

export default function Menu() {
  return (
    <ul className="absolute bottom-14 openEmojiAnimation">
      <DocumentAttachment />
      <PhotoAttachment />
    </ul>
  );
}
