
declare type GAEvent = {
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
  eventValue?: number
}

declare function ga(command: string, hitType: string, event: GAEvent)

function gaEvent(event: GAEvent){
    ga("send", "event", event);
}
