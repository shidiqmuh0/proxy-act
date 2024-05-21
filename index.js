const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Membaca file proxies.txt
const proxiesFilePath = path.join(__dirname, 'proxies.txt');
const proxies = fs.readFileSync(proxiesFilePath, 'utf-8').split('\n').filter(Boolean);

const checkProxy = async (proxy) => {
    const [ip, port] = proxy.split(':');
    const proxyUrl = `http://${ip}:${port}`;

    try {
        // Menggunakan axios untuk melakukan request melalui proxy
        await axios.get('http://www.google.com', {
            proxy: {
                host: ip,
                port: parseInt(port)
            },
            timeout: 5000
        });
        return { proxy, isActive: true };
    } catch (error) {
        return { proxy, isActive: false };
    }
};

const checkProxies = async () => {
    const checkPromises = proxies.map(proxy => checkProxy(proxy));
    const results = await Promise.all(checkPromises);

    const activeProxies = results
        .filter(result => result.isActive)
        .map(result => result.proxy);

    // Menulis proxy aktif ke file output.txt
    const outputFilePath = path.join(__dirname, 'output.txt');
    fs.writeFileSync(outputFilePath, activeProxies.join('\n'), 'utf-8');

    // Output log untuk active dan inactive proxies
    results.forEach(result => {
        console.log(`${result.isActive ? 'Active' : 'Inactive'}: ${result.proxy}`);
    });
};

checkProxies();
