import * as React from 'react'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import { hashMessage } from 'ethers/lib/utils'


export function SignMessage() {
    const recoveredAddress = React.useRef<string>()
    const messageHash = React.useRef<string>()
    const { data, error, isLoading, signMessage } = useSignMessage({
        onSuccess(data, variables) {
        // Verify signature when sign message succeeds
        const address = verifyMessage(variables.message, data)
        recoveredAddress.current = address
        messageHash.current = hashMessage(variables.message)
        },
    })

    return (
    <form
    onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const message = formData.get('message')
        signMessage({ message })
        }}
    >
    <label htmlFor="message">Enter a message to sign</label>
    <textarea
        id="message"
        name="message"
        placeholder="The quick brown fox…"
    />
    <button disabled={isLoading}>
        {isLoading ? 'Check Wallet' : 'Sign Message'}
    </button>

    {data && (
        <div>
            <div>Recovered Address: {recoveredAddress.current}</div>
            <div>Signature: {data}</div>
            <div>MessageHash: {messageHash.current}</div>
        </div>
    )}

    {error && <div>{error.message}</div>}
        </form>
    )
}
