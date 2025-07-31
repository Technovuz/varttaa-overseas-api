const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Helper: delete array of files from disk safely
const deleteFiles = (files) => {
  if (!files || files.length === 0) return;
  files.forEach((filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting file:', filePath, err);
    }
  });
};

// CREATE machine (max 5 images)
const createMachine = async (req, res) => {
  try {
    const { name, type, price, description } = req.body;
    const commonSpecs = JSON.parse(req.body.commonSpecs || '{}');
    const typeSpecificSpecs = JSON.parse(req.body.typeSpecificSpecs || '{}');

    // Validation
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'Max 5 images allowed' });
    }

    // Prepare image URLs
    const imageUrls = req.files.map((file) => {
      const baseUrl = `${req.protocol}://${req.get('host')}/files`;
      return { url: `${baseUrl}/${file.filename}` };
    });

    // Define include options for later query
    const includeOptions = {
      commonSpecs: true,
      images: true,
    };
    switch (type) {
      case 'ICE_CREAM_MACHINE':
        includeOptions.iceCreamSpecs = true;
        break;
      case 'SUGARCANE_JUICE_MACHINE':
        includeOptions.sugarcaneJuiceSpecs = true;
        break;
      case 'HOT_BEVERAGE_VENDING_MACHINE':
        includeOptions.beverageVendingSpecs = true;
        break;
      case 'COFFEE_TEA_MACHINE':
        includeOptions.coffeeMachineSpecs = true;
        break;
      case 'PIZZA_OVEN':
        includeOptions.pizzaOvenSpecs = true;
        break;
      case 'POPCORN_MACHINE':
        includeOptions.popcornMachineSpecs = true;
        break;
      case 'SWEET_CORN_MACHINE':
        includeOptions.sweetCornMachineSpecs = true;
        break;
      case 'WAFFLE_MAKER':
        includeOptions.waffleMakerSpecs = true;
        break;
      case 'STAINLESS_STEEL_DEEP_FRYER':
        includeOptions.deepFryerSpecs = true;
        break;
      default:
        break;
    }

    // Transaction: create machine and type-specific specs
    const fullMachine = await prisma.$transaction(async (prisma) => {
      // Step 1: Create machine with common specs and images
      const createdMachine = await prisma.machine.create({
        data: {
          name,
          type,
          price: parseFloat(price),
          description,
          commonSpecs: { create: commonSpecs },
          images: { create: imageUrls },
        }
      });

      // Step 2: Create type-specific specs
      switch (type) {
        case 'ICE_CREAM_MACHINE':
          await prisma.iceCreamSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'SUGARCANE_JUICE_MACHINE':
          await prisma.sugarcaneJuiceSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'HOT_BEVERAGE_VENDING_MACHINE':
          await prisma.beverageVendingSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'COFFEE_TEA_MACHINE':
          await prisma.coffeeMachineSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'PIZZA_OVEN':
          await prisma.pizzaOvenSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'POPCORN_MACHINE':
          await prisma.popcornMachineSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'SWEET_CORN_MACHINE':
          await prisma.sweetCornMachineSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'WAFFLE_MAKER':
          await prisma.waffleMakerSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        case 'STAINLESS_STEEL_DEEP_FRYER':
          await prisma.deepFryerSpecs.create({ data: { machineId: createdMachine.id, ...typeSpecificSpecs } });
          break;
        default:
          break;
      }

      // Step 3: Query the complete machine with all includes
      const machineWithDetails = await prisma.machine.findUnique({
        where: { id: createdMachine.id },
        include: includeOptions,
      });

      return machineWithDetails;
    });

    res.status(201).json(fullMachine);
  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({ error: error.message });
  }
};


// GET all machines
const getMachines = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = { isDeleted: false, deletedAt: null
                    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) where.type = type;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const machines = await prisma.machine.findMany({
      where,
      include: {
        commonSpecs: true,
        images: true,
        ...getTypeSpecificInclude(type)
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ error: error.message });
  }
};


// GET machine by ID
const getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await prisma.machine.findUnique({
      where: { isDeleted: false,
         id: parseInt(id) },
      include: {
        commonSpecs: true,
        images: true,
        ...getTypeSpecificInclude()
      }
    });
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE machine + replace images, delete old images
const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, description } = req.body;
    const commonSpecs = JSON.parse(req.body.commonSpecs || '{}');
    const typeSpecificSpecs = JSON.parse(req.body.typeSpecificSpecs || '{}');

    const machineId = parseInt(id);
    const existingMachine = await prisma.machine.findUnique({
      where: { id: machineId },
      include: { images: true }  // Include existing images
    });
    if (!existingMachine) return res.status(404).json({ error: 'Machine not found' });

    let newImageUrls = null;
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) return res.status(400).json({ error: 'Max 5 images allowed' });

      const baseUrl = `${req.protocol}://${req.get('host')}/files`;
      newImageUrls = req.files.map(file => ({ url: `${baseUrl}/${file.filename}` }));

      // Delete old images from disk and DB
      deleteFiles(existingMachine.images.map(img => path.join('files', path.basename(img.url))));
      await prisma.machineImage.deleteMany({ where: { machineId } });
    }

    // Update machine fields
    const updatedMachine = await prisma.machine.update({
      where: { id: machineId },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(price && { price: parseFloat(price) }),
        ...(description && { description }),
        ...(newImageUrls && { images: { create: newImageUrls } }),
      },
      include: {
        commonSpecs: true,
        images: true
      }
    });

    // Update common specs
    await prisma.commonSpecs.update({
      where: { machineId },
      data: commonSpecs
    });

    // Update type-specific specs safely
    await updateTypeSpecificSpecs(machineId, type || existingMachine.type, typeSpecificSpecs);

    res.json(updatedMachine);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: error.message });
  }
};


// DELETE machine + specs + delete images from disk
const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const machineId = parseInt(id);

    const existingMachine = await prisma.machine.findFirst({
      where: { id: machineId, isDeleted: false },
      include: { images: true }
    });

    if (!existingMachine) return res.status(404).json({ error: 'Machine not found or already deleted' });

    // Soft delete
    await prisma.machine.update({
      where: { id: machineId },
      data: { isDeleted: true }
    });

    // Optionally remove related specs and files
    await Promise.all([
      prisma.iceCreamSpecs.deleteMany({ where: { machineId } }),
      prisma.sugarcaneJuiceSpecs.deleteMany({ where: { machineId } }),
      prisma.beverageVendingSpecs.deleteMany({ where: { machineId } }),
      prisma.coffeeMachineSpecs.deleteMany({ where: { machineId } }),
      prisma.pizzaOvenSpecs.deleteMany({ where: { machineId } }),
      prisma.popcornMachineSpecs.deleteMany({ where: { machineId } }),
      prisma.sweetCornMachineSpecs.deleteMany({ where: { machineId } }),
      prisma.waffleMakerSpecs.deleteMany({ where: { machineId } }),
      prisma.deepFryerSpecs.deleteMany({ where: { machineId } }),
      prisma.commonSpecs.deleteMany({ where: { machineId } }),
    ]);

    res.status(200).json({ message: 'Machine soft-deleted successfully' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ error: error.message });
  }
};



// Helper: include type-specific spec for queries
function getTypeSpecificInclude(type) {
  switch (type) {
    case 'ICE_CREAM_MACHINE': return { iceCreamSpecs: true };
    case 'SUGARCANE_JUICE_MACHINE': return { sugarcaneJuiceSpecs: true };
    case 'HOT_BEVERAGE_VENDING_MACHINE': return { beverageVendingSpecs: true };
    case 'COFFEE_TEA_MACHINE': return { coffeeMachineSpecs: true };
    case 'PIZZA_OVEN': return { pizzaOvenSpecs: true };
    case 'POPCORN_MACHINE': return { popcornMachineSpecs: true };
    case 'SWEET_CORN_MACHINE': return { sweetCornMachineSpecs: true };
    case 'WAFFLE_MAKER': return { waffleMakerSpecs: true };
    case 'STAINLESS_STEEL_DEEP_FRYER': return { deepFryerSpecs: true };
    default:
      return {
        iceCreamSpecs: true,
        sugarcaneJuiceSpecs: true,
        beverageVendingSpecs: true,
        coffeeMachineSpecs: true,
        pizzaOvenSpecs: true,
        popcornMachineSpecs: true,
        sweetCornMachineSpecs: true,
        waffleMakerSpecs: true,
        deepFryerSpecs: true
      };
  }
}

// Helper: update type-specific specs safely
async function updateTypeSpecificSpecs(machineId, type, data) {
  switch (type) {
    case 'ICE_CREAM_MACHINE': return prisma.iceCreamSpecs.update({ where: { machineId }, data });
    case 'SUGARCANE_JUICE_MACHINE': return prisma.sugarcaneJuiceSpecs.update({ where: { machineId }, data });
    case 'HOT_BEVERAGE_VENDING_MACHINE': return prisma.beverageVendingSpecs.update({ where: { machineId }, data });
    case 'COFFEE_TEA_MACHINE': return prisma.coffeeMachineSpecs.update({ where: { machineId }, data });
    case 'PIZZA_OVEN': return prisma.pizzaOvenSpecs.update({ where: { machineId }, data });
    case 'POPCORN_MACHINE': return prisma.popcornMachineSpecs.update({ where: { machineId }, data });
    case 'SWEET_CORN_MACHINE': return prisma.sweetCornMachineSpecs.update({ where: { machineId }, data });
    case 'WAFFLE_MAKER': return prisma.waffleMakerSpecs.update({ where: { machineId }, data });
    case 'STAINLESS_STEEL_DEEP_FRYER': return prisma.deepFryerSpecs.update({ where: { machineId }, data });
    default: return Promise.resolve();;
  }
}

module.exports = {
  createMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine
};
