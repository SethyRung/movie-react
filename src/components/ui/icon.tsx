import { Icon, addCollection } from "@iconify/react/offline";
import { icons as lucideIcons } from "@iconify-json/lucide";
import { icons as simpleIcons } from "@iconify-json/simple-icons";

addCollection(lucideIcons);
addCollection(simpleIcons);

export { Icon };
