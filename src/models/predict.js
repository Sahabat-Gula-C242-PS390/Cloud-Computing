const tf = require('@tensorflow/tfjs-node');
const path = require('path');

export async function loadModel() {
  try {
    const modelPath = path.resolve(__dirname, 'model.json'); // Use absolute paths to avoid issues
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('model loaded');
    return model;
  } catch (error) {
    throw new Error(`Failed to load model: ${error.message}`);
  }
}

const groceryLabels = [
    'Indomie-Kari-Ayam-72g', 'ABC-Kopi-Susu-30g', 'Ultra-Milk-Coklat-125ml', 
    'Indomie-Soto-72g', 'Indomie-Goreng-72g', 'Teh-Kotak-Original-200ml', 
    'Good-Day-Mocacinno-20g', 'Good-Day-Cappuccino-25g', 'Kapal-Api-Signature-25g', 
    'Sari-Gandum-Sandwich-Susu-Cokelat-27g', 'Energen-Cokelat-34g', 'Energen-Vanila-34g', 
    'Nabati-Coklat-37g', 'Superstar-Chocolate-16g', 'Nutrisari-Sweet-Orange-14g', 
    'Tango-Royal-Chocolate-35g', 'Indocafe-Coffeemix-20g', 'Nabati-Keju-37g', 
    'Luwak-White-Coffee-20g', 'Indomilk-Kids-Cokelat-115ml'
];

// Function to predict grocery items
export async function predictGroceryNutrition(model, imageStream) {
    try {
        // Read image stream into a buffer
        const chunks = [];
        for await (const chunk of imageStream) {
            chunks.push(chunk);
        }
        const imageBuffer = Buffer.concat(chunks);

        // Decode image buffer into a tensor
        const tensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeBilinear([224, 224]) // Adjust dimensions based on the trained model's input
            .expandDims()
            .toFloat()
            .div(tf.scalar(255.0));
        console.log("Converting grocery image to tensor");

        // Make prediction
        const prediction = model.predict(tensor);
        const score = await prediction.array();

        // Calculate the most confident class
        const confidenceScore = Math.max(...score[0]) * 100;
        const classResult = score[0].indexOf(Math.max(...score[0]));

        // Fetch the result from the labels
        const result = groceryLabels[classResult];
        console.log('Prediction result:', result);

        return {
            item: result,
            confidenceScore: confidenceScore.toFixed(2)
        };

    } catch (error) {
        throw new Error(`An error occurred during grocery prediction: ${error.message}`);
    }
}
