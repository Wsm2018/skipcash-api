const express = require("express");
const { v4 } = require("uuid");
const fetch = require("node-fetch");
const cryptojs = require("crypto-js");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.bodyParser());

const paymentGatewayDetails = {
	paymentURL: "https://skipcashtest.azurewebsites.net",
	secretKey:
		"rFszhTuvgQWV1JNGpJ/M0FcGFomDcmjsMS9/4YfG38NBKApAVl0pXgKq1zdbTVOwfL4VXFg/uKK7wvK1PRTtRL3IsV8z/a84g6kRME3vEVTO4HKu+zqrIcGs2zrGUHIMhT/EDwZTnpGMZvdfjA6L0n5XAkIiW/aK052pNzZAmG0FiciuGvMBQsu/7+P/iwqsUcro1RnLXm1Mn50c1JWAsinGy270YrDTa04JmQiOPTPLFzSs0ULDPftruDNrtCNrYasni/INiuILIUFnzQaznrXuB6zGk4mcalITkZywkFC9c5tv32JPYSMMhixif4/95Gog5l8hTkExXOTQwA1tTBUtRqmEQpSS9sCQZ3r0M7xMSgfS9DiCsz0wrUA5YIr89tb5CKw3ZPRncHUM9OnCRixvme7Yqkabag8ArPTox0UVBJNlUFynAfpErKC8Eqd7W2KuOZQ00jMzMOrSOZdRRVlysqbNCoRpByV25n/FOLKOebld/eWjtU0CrKsaPXQ/adkpJIYvf+BrY5I+Ix48Wg==",
	clientId: "f2941433-083c-4ed7-8afb-c9ebde3a5812",
	webhookKey: "83576f6b-2319-474f-b6f7-ad78d92a9f3d",
};

const paymentDetails = {
	Uid: v4(),
	KeyId: "e7fb256d-ffbb-4b71-b419-f43741c43280",
	Amount: "500.41",
	FirstName: "Wasim",
	LastName: "Ibrahim",
	Email: "wasim@skipcash.com",
};

const combinedData = `Uid=${paymentDetails.Uid},KeyId=${paymentDetails.KeyId},Amount=${paymentDetails.Amount},FirstName=${paymentDetails.FirstName},LastName=${paymentDetails.LastName},Email=${paymentDetails.Email}`;

// console.log("combined data ", combinedData);

const hash = cryptojs.HmacSHA256(combinedData, paymentGatewayDetails.secretKey);
const hashInBase64 = cryptojs.enc.Base64.stringify(hash);
// console.log("\nHMACSHA256", hashInBase64);

// console.log("\nreq body", JSON.stringify(paymentDetails));

const getPaymentURL = async () => {
	// console.log("payment ", hashInBase64);
	try {
		const url = `${paymentGatewayDetails.paymentURL}/api/v1/payments`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: hashInBase64,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentDetails),
		});
		const json = await response.json();
		// console.log("response ", json);
		return json;
	} catch (err) {
		return err.message;
	}
};

app.get("/pay", async (req, res) => {
	const payment = await getPaymentURL();
	// console.log("payment details ", payment);
	res.send(payment);
});

const webhookURL = async (req, res) => {
	console.log("request ", await req.json());
	// console.log("RESPPONSE ", res.json());
};

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/callback", (req, res) => {
	webhookURL(req, res);
	res.send("Call back called");
});

app.listen(port, () => {
	// console.log(`Example app listening at http://localhost:${port}`)
});
