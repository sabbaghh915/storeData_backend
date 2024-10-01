require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const usersRoute = require('./routes/users');
const sectionSchema = require('./models/sectionSchema');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/worddata', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);
app.use(usersRoute);


// Endpoint for uploading a Word document
app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;

    try {
        const options = {
            transformDocument: mammoth.transforms.paragraph((element) => {
                if (element.children && element.children.length > 0) {
                    element.children = element.children.map((child) => {
                        if (child.type === "table") {
                            return {
                                type: "paragraph",
                                children: child.children.map(row => {
                                    return {
                                        type: "run",
                                        text: row.children.map(cell => cell.textContent.trim()).join('\t')
                                    };
                                })
                            };
                        }
                        return child;
                    });
                }
                return element;
            })
        };

        const result = await mammoth.extractRawText({ buffer: file.data }, options);
        const content = result.value;

        res.send({ message: 'تم تحميل الملف واستخراج النص', text: content });
    } catch (error) {
        console.error('Error processing the file:', error);
        res.status(500).send('Error processing the file.');
    }
});

// Function to check if a collection exists
const findCollection = async (collectionName) => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.some(collection => collection.name === collectionName);
};

// Function to get a model or define it if it doesn't exist
const getModel = (collectionName) => {
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    } else {
        const schema = new mongoose.Schema({
            name: String,
            description: String,
            namePersons: { type: [String], default: [] },
            namePersonsFather: { type: [String], default: [] },
            namePersonsMother: { type: [String], default: [] },
            namePersonsBDay: { type: [String], default: [] },
            namePersonsCity: { type: [String], default: [] },
            namePersonsAddress: { type: [String], default: [] },
            namePersonsNumber: { type: [String], default: [] },
            nameCompanys: { type: [String], default: [] },
            nameCompanysADay: { type: [String], default: [] },
            nameCompanysAddress: { type: [String], default: [] },
            part: String,
            date: Date,
            ministry: String,
            text: String,
        });
        return mongoose.model(collectionName, schema, collectionName);
    }
};

// Endpoint for fetching sections from a specific collection
app.get('/sections/:collectionName', async (req, res) => {
    const { collectionName } = req.params;

    try {
        const collectionExists = await findCollection(collectionName);
        if (!collectionExists) {
            return res.status(404).send('Collection not found.');
        }
        const sections = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        res.send(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).send('Error fetching sections.');
    }
});

// Endpoint for saving sections
app.post('/sections', async (req, res) => {
    const { collectionName, sections } = req.body;

    if (!collectionName || !sections || sections.length === 0) {
        console.error('Invalid input: collectionName or sections missing');
        return res.status(400).send('Invalid input.');
    }

    console.log('Received sections:', sections); // Log the received data

    try {
        const SectionModel = getModel(collectionName);
        console.log(`Saving sections to collection: ${collectionName}`);
        await SectionModel.insertMany(sections);
        res.send('تم تخزين البيانات الى قاعد البيانات');
    } catch (error) {
        console.error('Error saving sections:', error);
        res.status(500).send('Error saving sections.');
    }
});

app.get('/collections', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        res.json(collectionNames);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).send('Error fetching collections');
    }
});

app.delete('/sections/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;

    try {
        // Use the sectionSchema to create a dynamic model for the collection
        const SectionModel = mongoose.model(collection, sectionSchema, collection);
        console.log(`Created dynamic model for collection: ${collection}`);

        // Convert the ID to an ObjectId and log it
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(`Converted ID to ObjectId: ${objectId}`);

        // Attempt to delete the document and log the result
        const deletedSection = await SectionModel.findByIdAndDelete(objectId);
        if (!deletedSection) {
            console.log(`Section with ID: ${id} not found in collection: ${collection}`);
            return res.status(404).json({ message: 'Section not found' });
        }

        console.log(`Section with ID: ${id} deleted successfully from collection: ${collection}`);
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error deleting section:', error);
        res.status(500).json({ message: 'Error deleting section' });
    }
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
