"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export const WalletConnect = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)

      // Try injected first (this will detect MetaMask)
      const injectedConnector = connectors.find((connector) => connector.id === "injected")

      if (injectedConnector) {
        console.log("Connecting with injected wallet (MetaMask)...")
        connect({ connector: injectedConnector })
      } else if (connectors.length > 0) {
        console.log("Connecting with first available connector...")
        connect({ connector: connectors[0] })
      }
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400">Connected: {formatAddress(address)}</span>
        </div>
        <Button className="transition-all  duration-500 ease-in-out   hover:opacity-100 bg-green-400" onClick={() => disconnect()} size="sm" variant="outline">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleConnect}
        size="sm"
        disabled={isPending || isConnecting}
        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white border-purple-600 hover:border-purple-700"
      >
        {isPending || isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      {error && <div className="text-xs text-red-400">Error: {error.message}</div>}
    </div>
  )
}
