import { allowedChains } from '../config'
import { AddressZero } from "@ethersproject/constants";
import { Provider } from "@ethersproject/providers";
import { Contract, ContractInterface, Signer } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`);
  return regex.test(amount);
}

export function units(coinsValue: string, decimals: number): string {
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount');
  let i = coinsValue.indexOf('.');
  if (i < 0) i = coinsValue.length;
  const s = coinsValue.slice(i + 1);
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length);
}

export function coins(unitsValue: string, decimals: number): string {
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount');
  if (decimals === 0) return unitsValue;
  const s = unitsValue.padStart(1 + decimals, '0');
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`;
}

export function formatShortAddress(addressFormat: string): string {
  return `${addressFormat.slice(0, 6)}...${addressFormat.slice(-6)}`;
}

export function formatShortAddressDescriptionNft(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}...`;
}

export function formatShortAddressWallet(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}`;
}

export function dollarFormat(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatSymbol(tokenSymbol: string) {
  return tokenSymbol.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol;
}

export function formatDomain(domain: string) {
  const domainName = domain.substr(0, domain.lastIndexOf('.'));
  const domainType = domain.substr(domain.lastIndexOf('.'));
  const formattedName = domainName.length > 9 ? `${domainName.substr(0, 3)}...${domainName.substr(-3)}` : domainName;

  return `${formattedName}${domainType}`;
}

export const isAllowedChain = (chainId: number | undefined): boolean => {
  if(!!chainId)
    return allowedChains.includes(chainId);
  return false;
}

export const sleep = (ms = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const hashcode = (value: string): number => {
  let hash = 0, i, chr;
  if (value.length === 0) return hash;
  for (let i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = hash & 0xfffffff;
  return hash;
}

export function getContract<T = Contract>(address: string, abi: ContractInterface, provider: Signer | Provider ) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return <T>(<unknown>new Contract(address, abi, provider));
}

export function parseBigNumberToFloat(val: BigNumber, decimals = 18) {
  if (!val) {
    return 0;
  }

  const formatted = formatUnits(val, decimals);
  const parsed = parseFloat(formatted);
  return parsed;
}