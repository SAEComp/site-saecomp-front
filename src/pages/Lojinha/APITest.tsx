import { useEffect, useState } from 'react';
import axios from 'axios';

const APITest = () => {
    const [healthStatus, setHealthStatus] = useState<string>('');
    const [productsData, setProductsData] = useState<any>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const testAPI = async () => {
            const testResults: string[] = [];
            
            // Test 1: Health check via proxy
            try {
                const healthResponse = await axios.get('/api/../health');
                setHealthStatus('Health check OK via proxy');
            } catch (error) {
                testResults.push(`Health check via proxy failed: ${error}`);
            }
            
            // Test 2: Health check direct
            try {
                const healthResponse = await axios.get('http://localhost:5001/health');
                setHealthStatus('Health check OK direct');
            } catch (error) {
                testResults.push(`Health check direct failed: ${error}`);
            }
            
            // Test 3: Products via proxy
            try {
                const productsResponse = await axios.get('/api/products');
                setProductsData(productsResponse.data);
            } catch (error) {
                testResults.push(`Products via proxy failed: ${error}`);
            }
            
            // Test 4: Products direct
            try {
                const productsResponse = await axios.get('http://localhost:5001/api/products');
                setProductsData(productsResponse.data);
            } catch (error) {
                testResults.push(`Products direct failed: ${error}`);
            }
            
            setErrors(testResults);
        };
        
        testAPI();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>API Test Results</h1>
            
            <h2>Health Status:</h2>
            <p>{healthStatus || 'Testing...'}</p>
            
            <h2>Products Data:</h2>
            <pre>{productsData ? JSON.stringify(productsData, null, 2) : 'Loading...'}</pre>
            
            <h2>Errors:</h2>
            {errors.map((error, index) => (
                <p key={index} style={{ color: 'red' }}>{error}</p>
            ))}
            
            {errors.length === 0 && productsData && (
                <p style={{ color: 'green' }}>✅ All tests passed!</p>
            )}
        </div>
    );
};

export default APITest;
