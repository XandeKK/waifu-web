class JobFile
	def self.start
		@queue = []
		@thread = Thread.new do
			loop do
				@queue.each_with_index do |element, index|
					if element[:time] < Time.now
						File.delete(element[:filename])
						@queue.delete_at(index)
					end
				end
			end
		end
	end

	def self.perform(filename, minutes=10)
		@queue.push({
			filename: filename,
			time: Time.now + 60 * minutes
		})
	end

	def self.stop
		@thread.exit
	end
end
