+++
title = "Getting a Root Shell on a $25 IoT Plug (a UART story)"
date = 2026-05-28T10:00:00+02:00
draft = false
kicker = "embedded // hardware"
description = "From a sealed no-name smart plug to a root shell over UART, then a full firmware dump for offline analysis."
tags = ["embedded", "iot", "uart", "firmware"]
toc = true
+++

This is a walkthrough of how I went from a sealed, no-name smart plug to a root
shell over UART, and from there to a full firmware dump for offline reversing.

> Everything below was done on hardware I own, on an isolated lab network. Do
> the same.

## Recon

A quick network look from the LAN it joined:

```bash
$ nmap -sV -p- 192.168.50.42
PORT     STATE SERVICE
23/tcp   open  telnet
80/tcp   open  http
6668/tcp open  unknown   # vendor C2 channel
```

An open `telnet` on an IoT device is already a smell. The faster path was
physical, so I went for the UART.

## Getting a shell

Wire up a USB-to-TTL adapter (device `TX` → adapter `RX`, and vice versa), open
the console, and ask an unlocked U-Boot for a root shell:

```bash
=> setenv bootargs ${bootargs} init=/bin/sh
=> boot
...
/ # id
uid=0(root) gid=0(root)
```

That's root. No password, no exploit — just an unlocked bootloader.

## What the firmware gave up

The vendor C2 daemon parsed length-prefixed packets into a fixed stack buffer
with no bounds check:

```c
void handle_packet(int fd) {
    char buf[256];
    uint16_t len;
    read(fd, &len, 2);
    read(fd, buf, len);   // len is attacker-controlled, buf is 256 bytes
    dispatch(buf);
}
```

A textbook stack overflow reachable from the LAN, on a binary with no canary and
an `RWX` stack. But that's a writeup for another day.

## Takeaways

- An unlocked bootloader is a root shell waiting to happen.
- "Secrets" derived from printed serial numbers are not secrets.
- Dump the firmware early; most bugs are easier to find statically.

## Timeline

| Date       | Event                    |
|------------|--------------------------|
| 2026-05-10 | Reported to vendor       |
| 2026-05-12 | Vendor acknowledged      |
| 2026-05-28 | This post                |
