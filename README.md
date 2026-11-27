# Adams Services demo

Working prototype of the Adams Services waste operating system for a client meeting. Sample customers, sample invoices, and demo payments. It does not call Stripe, maps, or a texting service.

Live demo: https://322murphy.github.io/adams-services-demo/

## Run

```bash
cd adams-os
npm run dev
```

Open http://localhost:3000. Use the black bar to jump between Public, Office, Customer, and Driver. **Script** is the click path. **Reset sample data** puts the story back to the start.

## Meeting path

1. Home: check ZIP `78602`, then `78704`.
2. Start service: **Use sample signup**, then submit.
3. Office applications: approve it. That opens an account and a cart-delivery work order.
4. Customers: search, open Maria Gonzalez (`AS-1008`), export CSV.
5. Plans and territory: rate version 2 is the one the driver uses.
6. Invoice `INV-1048`.
7. Customer portal: demo card payment.
8. Dispatch: Friday Bastrop.
9. Driver: leave **2 carts** and **3 bags**, attach sample evidence, submit. The charge is **$25.00** (1 extra cart at $10 and 3 bags at $5). The driver cannot type a price.
10. Approve that extra onto `INV-1048`.
11. The portal shows the line. Fleet, equipment, work orders, and reports use the same records.

Sample logins, password `demo`: `office`, `maria`, `driver`.

## Money

All amounts are integer cents in `lib/billing.ts`. A second submit of the same stop is ignored.
