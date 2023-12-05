
export const getKeyModifier = (keyEvent: KeyboardEvent) => {
  if(!keyEvent) return

  if(keyEvent?.ctrlKey == true && keyEvent?.altKey == false)
  {
      return 'CTRL'
  }else if(keyEvent?.ctrlKey == false && keyEvent?.altKey == true)
  {
      return 'ALT'
  }

  return 'NONE'
}
