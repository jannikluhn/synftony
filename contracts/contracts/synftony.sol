// "SPDX-License-Identifier: MIT"

pragma solidity =0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

contract Synftony is ERC721Enumerable, Ownable, PullPayment {

    event BarChanged(
        uint256 indexed barIndex,
        string abc
    );
    event PriceChanged(
        uint256 newPrice
    );
    event BaseURIChanged(
        string newBaseURI
    );

    uint256 public numBars;
    uint256 public price;
    string public baseURI;

    constructor(uint256 barPrice) ERC721("SN1", "SynftonyNo1") {
        numBars = 0;
        price = barPrice;
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
        emit PriceChanged({
            newPrice: newPrice
        });
    }

    function setBaseURI(string calldata newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged({
            newBaseURI: newBaseURI
        });
    }

    function mintBar(address receiver, uint256 barIndex, string calldata abc) public payable {
        require(barIndex == numBars, "Synftony: bar index not correct");
        require(msg.value == price, "Synftony: wrong payment amount");

        _mint(receiver, barIndex);
        _asyncTransfer(owner(), msg.value);
        numBars += 1;

        emit BarChanged({
            barIndex: barIndex,
            abc: abc
        });
    }

    function changeBar(uint256 barIndex, string calldata abc) public {
        require(_isApprovedOrOwner(msg.sender, barIndex), "Synftony: sender is not owner nor approved");
        emit BarChanged({
            barIndex: barIndex,
            abc: abc
        });
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

}
