"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

function notImplemented() {
  alert("Not implemented")
}

export default function MainMenuBar() {
  return <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={notImplemented}>Import</MenubarItem>
        <MenubarItem onClick={notImplemented}>Export</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={notImplemented}>Undo<MenubarShortcut>Ctrl+Z</MenubarShortcut></MenubarItem>
        <MenubarItem onClick={notImplemented}>Redo<MenubarShortcut>Ctrl+Shift+Z</MenubarShortcut></MenubarItem>
        <MenubarSeparator/>
        <MenubarItem onClick={notImplemented}>Copy</MenubarItem>
        <MenubarItem onClick={notImplemented}>Paste</MenubarItem>
        <MenubarItem onClick={notImplemented}>Delete</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
}