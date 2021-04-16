import {
  BarChanged,
  Transfer
} from "../generated/Synftony/Synftony"
import { Bar } from "../generated/schema"

export function handleBarChanged(event: BarChanged): void {
  let bar = Bar.load(event.params.barIndex.toHex())
  bar.abc = event.params.abc
  bar.save()
}

export function handleTransfer(event: Transfer): void {
  let bar = Bar.load(event.params.tokenId.toHex())
  if (bar == null) {
    bar = new Bar(event.params.tokenId.toHex())
    bar.abc = ""
  }
  bar.owner = event.params.to
  bar.save()
}
